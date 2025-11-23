import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from './entities/profesor.entity';
import { Persona } from '../usuarios/entities/persona.entity';
import { Horario } from '../horarios/entities/horario.entity';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor';

@Injectable()
export class ProfesoresService {
  constructor(
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,

    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,

    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>, // 👈 FALTABA ESTO
  ) {}

  // Crear Profesor + Persona asociada
  async create(dto: CreateProfesorDto) {
    const persona = this.personaRepository.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      documento: dto.documento,
      tipoPersona_id: 2,
      activo: true,
    });

    const personaGuardada = await this.personaRepository.save(persona);

    const profesor = this.profesorRepository.create({
      titulo: dto.titulo,
      persona: personaGuardada,
    });

    return this.profesorRepository.save(profesor);
  }

  // Traer todos los profesores
  async findAll() {
    return this.profesorRepository.find({
      relations: ['persona'],
      order: { profesor_id: 'ASC' },
    });
  }

  // Actualizar
  async update(id: number, dto: UpdateProfesorDto) {
    const profesor = await this.profesorRepository.findOne({
      where: { profesor_id: id },
      relations: ['persona'],
    });

    if (!profesor) throw new NotFoundException('Profesor no encontrado');

    this.personaRepository.merge(profesor.persona, {
      nombre: dto.nombre ?? profesor.persona.nombre,
      apellido: dto.apellido ?? profesor.persona.apellido,
      documento: dto.documento ?? profesor.persona.documento,
      activo: dto.activo ?? profesor.persona.activo,
    });

    await this.personaRepository.save(profesor.persona);

    if (dto.titulo !== undefined) {
      profesor.titulo = dto.titulo;
    }

    return this.profesorRepository.save(profesor);
  }

  // Eliminar solo si no tiene horarios
  async remove(id: number) {
      console.log("ID a eliminar:", id);
    const profesor = await this.profesorRepository.findOne({
      where: { profesor_id: id },
      relations: ['persona'],
    });

    if (!profesor) throw new NotFoundException('Profesor no encontrado');

    const horariosAsignados = await this.horarioRepository.count({
      where: { profesor: { profesor_id: id } },
    });

    if (horariosAsignados > 0) {
      throw new BadRequestException(
        'El profesor tiene horarios asignados y no puede ser eliminado.'
      );
    }

    await this.profesorRepository.remove(profesor);
    await this.personaRepository.remove(profesor.persona);

    return { message: 'Profesor eliminado correctamente' };
  }
}


