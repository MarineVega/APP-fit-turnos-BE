import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { Horario } from './entities/horario.entity';
import { Actividad } from 'src/actividades/entities/actividad.entity';
import { Profesor } from 'src/profesores/entities/profesor.entity';
import { Hora } from 'src/horas/entities/hora.entity';

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
  ) {}

  private tienenDiasEnComun(diasA: string, diasB: string): boolean {
    const arrA = diasA.split(',').map(d => d.trim().toLowerCase());
    const arrB = diasB.split(',').map(d => d.trim().toLowerCase());

    return arrA.some(d => arrB.includes(d));      // true → hay coincidencia
  }

  // Obtengo todos los horarios
  public async findAll(): Promise<Horario[]> {
    const horarios = await this.horarioRepository.find({
      relations: ['actividad', 'profesor', 'hora']
    });

    return horarios;    
  }

  // Obtengo un horario por ID
  public async findOne(id: number): Promise<Horario> {
    const horario = await this.horarioRepository.findOne({ where: { horario_id: id } });
    
    if (!horario) {
      throw new NotFoundException(`Horario con id ${id} no encontrado`);
    }
    return horario;
  }

  // Creo un nuevo horario
  public async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
    try {

      const horariosExistentes = await this.horarioRepository.find({
        relations: ['actividad', 'profesor', 'hora']
      });

      for (const h of horariosExistentes) {
        const mismaActividad = h.getActividad().actividad_id === createHorarioDto.actividad_id;

        const mismoProfesor =
          (h.getProfesor() === null && !createHorarioDto.profesor_id) ||
          (h.getProfesor()?.profesor_id === createHorarioDto.profesor_id);

        const mismaHora = h.getHora().hora_id === createHorarioDto.hora_id;

        if (mismaActividad && mismoProfesor && mismaHora) {
          const diasNormalizados = createHorarioDto.dias
          .split(',')
          .map(d => d.trim().toLowerCase())
          .join(','); 

          if (this.tienenDiasEnComun(h.getDias(), diasNormalizados)) {
            throw new BadRequestException(
              `Ya existe un horario con misma actividad, profesor, hora y días superpuestos.`
            );
          }
        }
      }

      const { actividad_id, profesor_id, dias, hora_id, cupoMaximo, activo } = createHorarioDto;

      const actividad = await this.actividadRepository.findOne({ where: { actividad_id } });
      if (!actividad) throw new BadRequestException(`Actividad con id ${actividad_id} no encontrada.`);

      /*
      const profesor = await this.profesorRepository.findOne({ where: { profesor_id } });
      if (!profesor) throw new BadRequestException(`Profesor con id ${profesor_id} no encontrado.`);
      */
      let profesor: Profesor | null = null;

      if (profesor_id) {
        profesor = await this.profesorRepository.findOne({ where: { profesor_id } });
        if (!profesor) {
          throw new BadRequestException(`Profesor con id ${profesor_id} no encontrado.`);
        }
      }

      if (!dias || dias.trim() === "") {
        throw new BadRequestException("Debe seleccionar al menos un día.");
      }

      const hora = await this.horaRepository.findOne({ where: { hora_id } });
      if (!hora) throw new BadRequestException(`Hora con id ${hora_id} no encontrada.`);

      let horario : Horario = await this.horarioRepository.save(
        new Horario (
          actividad, 
          profesor, 
          dias.toLowerCase().trim(),    // lo guardo en minúsculas y sin esapacios en los extremos        
          hora, 
          cupoMaximo ?? null, 
          activo
        )
      );

      if (!horario) {
        throw new BadRequestException('No se pudo crear el horario.');
      }

      return horario;

    } catch (error) {
      if (error instanceof HttpException) throw error;      
      throw new InternalServerErrorException(
          "Ocurrió un error inesperado al crear el horario."
      );
    }
  }

  // Actualizo un horario existente
  public async update(id: number, updateHorarioDto: UpdateHorarioDto): Promise<Horario> {
    try {

      const horariosExistentes = await this.horarioRepository.find({
        relations: ['actividad', 'profesor', 'hora']
      });

      for (const h of horariosExistentes) {
        if (h.horario_id === id) continue; // saltar este mismo

        const mismaActividad = 
          (updateHorarioDto.actividad_id ?? h.getActividad().actividad_id) === h.getActividad().actividad_id;

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

        if (mismaActividad && mismoProfesor && mismaHora) {
          if (this.tienenDiasEnComun(h.getDias(), diasNuevos)) {
            throw new BadRequestException(
              `Ya existe otro horario con misma actividad, profesor, hora y días superpuestos.`
            );
          }
        }
      }

      let horario = await this.findOne(id);
      if (!horario) throw new BadRequestException('No se encuentra el horario');

      if (updateHorarioDto.actividad_id !== undefined) {
        const actividad = await this.actividadRepository.findOne({ where: { actividad_id: updateHorarioDto.actividad_id } });
        if (!actividad) throw new BadRequestException(`Actividad con id ${updateHorarioDto.actividad_id} no encontrada.`);
        horario.setActividad(actividad);
      }
/*
      if (updateHorarioDto.profesor_id !== undefined) {
        const profesor = await this.profesorRepository.findOne({ where: { profesor_id: updateHorarioDto.profesor_id } });
        if (!profesor) throw new BadRequestException(`Profesor con id ${updateHorarioDto.profesor_id} no encontrado.`);
        horario.setProfesor(profesor);
      }
*/
      if ('profesor_id' in updateHorarioDto) {
        let profesor: Profesor | null = null;

        if (updateHorarioDto.profesor_id) {
          profesor = await this.profesorRepository.findOne({
            where: { profesor_id: updateHorarioDto.profesor_id },
          });

          if (!profesor) {
            throw new BadRequestException(`Profesor con id ${updateHorarioDto.profesor_id} no encontrado.`);
          }
        }

        horario.setProfesor(profesor);
      }

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


      if (updateHorarioDto.hora_id !== undefined) {
        const hora = await this.horaRepository.findOne({ where: { hora_id: updateHorarioDto.hora_id } });
        if (!hora) throw new BadRequestException(`Hora con id ${updateHorarioDto.hora_id} no encontrada.`);
        horario.setHora(hora);
      }

      if (updateHorarioDto.cupoMaximo !== undefined) {
        horario.setCupoMaximo(updateHorarioDto.cupoMaximo);
      }

      if (updateHorarioDto.activo !== undefined) {
        horario.setActivo(updateHorarioDto.activo);
      }

      horario = await this.horarioRepository.save(horario);

      if (!horario)
        throw new BadRequestException('No se pudo modificar el horario');
      else
        return horario;

    } catch (error) {      
      console.error("ERROR EN update():", error);

      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Ocurrió un error inesperado al modificar el horario."
      );
    }
  }

  // Eliminar un horario
  public async delete(id: number): Promise<boolean> {
    try {
      const horario = await this.findOne(id);
      if (!horario) throw new BadRequestException('No se encuentra el horario');

      await this.horarioRepository.delete({ horario_id: id });
      return true;

    } catch (error) {
       console.error("ERROR EN delete():", error);

        if (error instanceof HttpException) throw error;

        throw new InternalServerErrorException(
          "Ocurrió un error inesperado al eliminar el horario."
        );
    }
  }
}
