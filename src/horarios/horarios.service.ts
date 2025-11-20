import { 
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { Horario } from './entities/horario.entity';
import { Actividad } from 'src/actividades/entities/actividad.entity';
import { Profesor } from 'src/profesores/entities/profesor.entity';
import { Hora } from 'src/horas/entities/hora.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,

    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,

    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,

    @InjectRepository(Hora)
    private readonly horaRepository: Repository<Hora>,

    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,

  ) {}

  private tienenDiasEnComun(diasA: string, diasB: string): boolean {
    const arrA = diasA.split(',').map(d => d.trim().toLowerCase());
    const arrB = diasB.split(',').map(d => d.trim().toLowerCase());

    return arrA.some(d => arrB.includes(d));      // true → hay coincidencia
  }

  private async tieneReservasActivas(horario_id: number): Promise<boolean> {
    const reservas = await this.reservaRepository.count({
      where: { 
        horario: { horario_id },
        activo: true
      },
    });
    return reservas > 0;
  }

  // Lista de días válidos
  private readonly DIAS_VALIDOS = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo"
  ];

  // Función que valida los días
  private validarDias(diasInput: string | string[]): string {
    // Convertir array → string
    let dias = Array.isArray(diasInput)
      ? diasInput.join(",")
      : diasInput;

    // Normalizar
    const lista = dias
      .split(",")
      .map(d => d.trim().toLowerCase())
      .filter(d => d !== "");

    if (lista.length === 0) {
      throw new BadRequestException("Debe indicar al menos un día.");
    }

    // Validar cada día
    for (const dia of lista) {
      if (!this.DIAS_VALIDOS.includes(dia)) {
        throw new BadRequestException(`El día "${dia}" no es válido.`);
      }
    }

    // Devolver normalizado
    return lista.join(",");
  }

  
  // --------------------------------------------------------------------
  // Obtengo todos los horarios
  // --------------------------------------------------------------------
  public async findAll(): Promise<Horario[]> {
    return await this.horarioRepository.find({
      relations: ['actividad', 'profesor', 'hora']
    });
  }

  // --------------------------------------------------------------------
  // Obtengo un horario por ID
  // --------------------------------------------------------------------
  public async findOne(id: number): Promise<Horario> {
    const horario = await this.horarioRepository.findOne({ where: { horario_id: id } });
    
    if (!horario) throw new NotFoundException(`Horario con id ${id} no encontrado`);

    return horario;
  }

  // --------------------------------------------------------------------
  // Creo un horario
  // --------------------------------------------------------------------
  public async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
    try {
      
      const { actividad_id, profesor_id, dias, hora_id, cupoMaximo, activo } = createHorarioDto;

      // 1 - Valido existencia de los IDs
      const actividad = await this.actividadRepository.findOne({ 
        where: { 
          actividad_id,
          activa: true
        } 
      });
      if (!actividad) throw new NotFoundException(`Actividad con id ${actividad_id} no encontrada o está desactivada.`);

      let profesor: Profesor | null = null;

      if (profesor_id) {
        profesor = await this.profesorRepository.findOne({ 
          where: { 
            profesor_id/*,
            activo: true*/
          } 
        });

        //if (!profesor) throw new NotFoundException(`Profesor con id ${profesor_id} no encontrado o está desactivado.`);
        if (!profesor) throw new NotFoundException(`Profesor con id ${profesor_id} no encontrado.`);
      }

     // if (!dias || dias.trim() === "") throw new BadRequestException("Debe seleccionar al menos un día.");
      const diasValidados = this.validarDias(dias);

      const hora = await this.horaRepository.findOne({ 
        where: { 
          hora_id,
          activa: true
        } 
      });
      if (!hora) throw new NotFoundException(`Hora con id ${hora_id} no encontrada o desactivada.`);


      // 2 - Valido solapamientos (mismo profesor, hora y días) solo si los IDs son correctos      
      const horariosExistentes = await this.horarioRepository.find({
        //relations: ['actividad', 'profesor', 'hora']
        relations: ['profesor', 'hora']
      });

      for (const h of horariosExistentes) {
        //const mismaActividad = h.getActividad().actividad_id === createHorarioDto.actividad_id;

        const mismoProfesor =
          (h.getProfesor() === null && !createHorarioDto.profesor_id) ||
          (h.getProfesor()?.profesor_id === createHorarioDto.profesor_id);

        const mismaHora = h.getHora().hora_id === createHorarioDto.hora_id;

        //if (mismaActividad && mismoProfesor && mismaHora) {
        if (mismoProfesor && mismaHora) {
          const diasNormalizados = createHorarioDto.dias
          .split(',')
          .map(d => d.trim().toLowerCase())
          .join(','); 

          if (this.tienenDiasEnComun(h.getDias(), diasNormalizados))  throw new BadRequestException(`Ya existe un horario asignado al profesor en la misma hora y días.`);
        }
      }

      // 3 - Creo horario
      const horario : Horario = await this.horarioRepository.save(
        new Horario (
          actividad, 
          profesor, 
          //dias.toLowerCase().trim(),    // lo guardo en minúsculas y sin esapacios en los extremos        
          diasValidados,
          hora, 
          cupoMaximo ?? null, 
          activo
        )
      );

      if (!horario) throw new BadRequestException('No se pudo crear el horario.');

      return horario;

    } catch (error) {
      if (error instanceof HttpException) throw error;      

      throw new InternalServerErrorException("Ocurrió un error inesperado al crear el horario.");
    }
  }

  // --------------------------------------------------------------------
  // Actualizo horario
  // --------------------------------------------------------------------
  public async update(id: number, updateHorarioDto: UpdateHorarioDto): Promise<Horario> {
    try {
      let horario = await this.findOne(id);      
      if (!horario) throw new NotFoundException(`Horario con id ${id} no encontrado.`);
      
      // No permito modificar si tiene reservas activa
      if (await this.tieneReservasActivas(id)) throw new BadRequestException('No se puede modificar el horario porque tiene reservas activas.');

      // 1 - Valido existencia de los IDs
      if (updateHorarioDto.actividad_id !== undefined) {
        const actividad = await this.actividadRepository.findOne({ 
          where: { 
            actividad_id: updateHorarioDto.actividad_id,
            activa: true
          } 
        });

        if (!actividad) throw new NotFoundException(`Actividad con id ${updateHorarioDto.actividad_id} no encontrada o está inactiva.`);

        horario.setActividad(actividad);
      }
      
      if ('profesor_id' in updateHorarioDto) {
        let profesor: Profesor | null = null;

        if (updateHorarioDto.profesor_id) {
          profesor = await this.profesorRepository.findOne({
            where: { profesor_id: updateHorarioDto.profesor_id },
          });

          if (!profesor) throw new BadRequestException(`Profesor con id ${updateHorarioDto.profesor_id} no encontrado.`);
        }

        horario.setProfesor(profesor);
      }
/*
      if (updateHorarioDto.dias !== undefined) {
        let diasFormateados: string;

        if (Array.isArray(updateHorarioDto.dias)) {
          // Si viene como array ["lunes","jueves"]
          diasFormateados = updateHorarioDto.dias.join(",");
        } else if (typeof updateHorarioDto.dias === "string") {
          // Si ya viene como string "lunes,jueves"
          diasFormateados = updateHorarioDto.dias;
        } else {
          throw new BadRequestException("Formato inválido para días.");
        }

        horario.setDias(diasFormateados);
      }
*/

      if (updateHorarioDto.dias !== undefined) {
        const diasValidados = this.validarDias(updateHorarioDto.dias);
        horario.setDias(diasValidados);
      }

      if (updateHorarioDto.hora_id !== undefined) {
        const hora = await this.horaRepository.findOne({ 
          where: { 
            hora_id: updateHorarioDto.hora_id,
            activa: true
          } 
        });
        if (!hora) throw new NotFoundException(`Hora con id ${updateHorarioDto.hora_id} no encontrada o está inactiva.`);
        horario.setHora(hora);
      }


      // 2 - Valido solapamientos (mismo profesor, hora y días) solo si los IDs son correctos   
      const horariosExistentes = await this.horarioRepository.find({
        relations: ['profesor', 'hora']
      });

      for (const h of horariosExistentes) {
        if (h.horario_id === id) continue;      // saltar este mismo
      
        const profIdNuevo = updateHorarioDto.profesor_id ?? h.getProfesor()?.profesor_id ?? null;
        const profIdExistente = h.getProfesor()?.profesor_id ?? null;

        const mismoProfesor =
          (profIdNuevo === null && profIdExistente === null) ||
          profIdNuevo === profIdExistente;

        const mismaHora =
          (updateHorarioDto.hora_id ?? h.getHora().hora_id) === h.getHora().hora_id;

        const diasNuevos = updateHorarioDto.dias
          ? updateHorarioDto.dias
            .split(',')
            .map(d => d.trim().toLowerCase())
            .join(',')
          : h.getDias();

        // Valido solapamiento: mismo profesor, hora y días
        if (mismoProfesor && mismaHora) {
          if (this.tienenDiasEnComun(h.getDias(), diasNuevos)) throw new BadRequestException(`Ya existe un horario asignado al profesor en la misma hora y días.`);
        }
      }
      
      // 3 - Aplico cambios
      // los otros seteos están en cada validación

      if (updateHorarioDto.cupoMaximo !== undefined) 
        horario.setCupoMaximo(updateHorarioDto.cupoMaximo);
      
      if (updateHorarioDto.activo !== undefined) 
        horario.setActivo(updateHorarioDto.activo);
      
      horario = await this.horarioRepository.save(horario);

      if (!horario) 
        throw new BadRequestException('No se pudo modificar el horario');
      else
        return horario;

    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error("ERROR EN update():", error);

      throw new InternalServerErrorException("Ocurrió un error inesperado al modificar el horario.");
    }
  }

  // --------------------------------------------------------------------
  // Elimino un horario
  // --------------------------------------------------------------------
  public async delete(id: number): Promise<boolean> {
    try {
      const horario = await this.findOne(id);
      if (!horario) throw new NotFoundException(`Horario con id ${id} no encontrado.`);

      // No permito eliminar si tiene reservas activa
      if (await this.tieneReservasActivas(id)) throw new BadRequestException('No se puede eliminar el horario porque tiene reservas activas.');
            
      await this.horarioRepository.delete({ horario_id: id });
      return true;

    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error("ERROR EN delete():", error);

      throw new InternalServerErrorException("Ocurrió un error inesperado al eliminar el horario.");
    }
  }
}
