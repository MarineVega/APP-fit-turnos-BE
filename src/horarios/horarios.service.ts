import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
  private horarios: Horario[] = [];

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

  // Obtengo todos los horarios
  public async findAll(): Promise<Horario[]> {
    //return await this.horarioRepository.find();

    const horarios = await this.horarioRepository.find({
      relations: ['actividad', 'hora'],           // omito 'profesor' por ahora
    });

    // harcodeo un "nombre de profesor" para no romper el front
    return horarios.map((h) => ({
      ...h,
      profesor: {
        profesor_id: h.getProfesor()?.profesor_id ?? 0,
        nombre: 'Profe',
        apellido: 'Demo',
      },
    })) as any;

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
      const { actividad_id, profesor_id, dias, hora_id, cupoMaximo, activo } = createHorarioDto;

      const actividad = await this.actividadRepository.findOne({ where: { actividad_id } });
      if (!actividad) throw new BadRequestException(`Actividad con id ${actividad_id} no encontrada.`);

      const profesor = await this.profesorRepository.findOne({ where: { profesor_id } });
      if (!profesor) throw new BadRequestException(`Profesor con id ${profesor_id} no encontrado.`);

      if (!dias || dias.trim() === "") {
        throw new BadRequestException("Debe seleccionar al menos un día.");
      }

      const hora = await this.horaRepository.findOne({ where: { hora_id } });
      if (!hora) throw new BadRequestException(`Hora con id ${hora_id} no encontrada.`);

      const nuevoHorario = new Horario(
        actividad, 
        profesor, 
        dias.toLowerCase().trim(),    // lo guardo en minúsculas y sin esapacios en los extremos
        hora, 
        cupoMaximo ?? null, 
        activo
      );

      const horario = await this.horarioRepository.save(nuevoHorario);

      if (!horario) {
        throw new BadRequestException('No se pudo crear el horario.');
      }

      return horario;

    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Error en la creación del horario: ' + error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Actualizo un horario existente
  public async update(id: number, updateHorarioDto: UpdateHorarioDto): Promise<Horario> {
    try {
      let horario = await this.findOne(id);

      if (updateHorarioDto.actividad_id !== undefined) {
        const actividad = await this.actividadRepository.findOne({ where: { actividad_id: updateHorarioDto.actividad_id } });
        if (!actividad) throw new BadRequestException(`Actividad con id ${updateHorarioDto.actividad_id} no encontrada.`);
        horario.setActividad(actividad);
      }

      if (updateHorarioDto.profesor_id !== undefined) {
        const profesor = await this.profesorRepository.findOne({ where: { profesor_id: updateHorarioDto.profesor_id } });
        if (!profesor) throw new BadRequestException(`Profesor con id ${updateHorarioDto.profesor_id} no encontrado.`);
        horario.setProfesor(profesor);
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
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Error en la actualización del horario: ' + error,
        },
        HttpStatus.BAD_REQUEST,
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
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Error en la eliminación del horario: ' + error,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
