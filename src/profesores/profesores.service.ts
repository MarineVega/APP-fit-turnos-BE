import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from './entities/profesor.entity';
import { Persona } from '../usuarios/entities/persona.entity';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor';

@Injectable()
export class ProfesoresService {
  constructor(
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,

    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  // 📌 Crear Profesor + Persona asociada
  async create(dto: CreateProfesorDto) {
    const persona = this.personaRepository.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      documento: dto.documento,
      tipoPersona_id: 2, // Profesor
      activo: true,
    });

    const personaGuardada = await this.personaRepository.save(persona);

    const profesor = this.profesorRepository.create({
      titulo: dto.titulo,
      persona: personaGuardada,
    });

    return this.profesorRepository.save(profesor);
  }

  // 📌 Traer todos los profesores con la persona asociada
  async findAll() {
  return this.profesorRepository.find({
    relations: ['persona'], // trae también el estado de activo
    order: { profesor_id: 'ASC' }, // opcional: ordenado por ID
  });
}
 // 📌 Actualizar Profesor + datos de Persona (incluido activo)
async update(id: number, dto: UpdateProfesorDto) {
  const profesor = await this.profesorRepository.findOne({
    where: { profesor_id: id },
    relations: ['persona'], // incluimos la relación para poder modificar
  });

  if (!profesor) throw new NotFoundException('Profesor no encontrado');

  // Actualizar datos personales
  if (
    dto.nombre !== undefined ||
    dto.apellido !== undefined ||
    dto.documento !== undefined ||
    dto.activo !== undefined // 👈 Agregamos activo para manejo
  ) {
    this.personaRepository.merge(profesor.persona, {
      nombre: dto.nombre ?? profesor.persona.nombre,
      apellido: dto.apellido ?? profesor.persona.apellido,
      documento: dto.documento ?? profesor.persona.documento,
      activo: dto.activo ?? profesor.persona.activo, // 👈 Actualiza activo si viene del front
    });

    await this.personaRepository.save(profesor.persona);
  }

  // Actualizar título si corresponde
  if (dto.titulo !== undefined) {
    profesor.titulo = dto.titulo;
  }

  return this.profesorRepository.save(profesor);
}

  // 🗑 Baja lógica -> se marca la persona como inactiva
  async remove(id: number) {
    const profesor = await this.profesorRepository.findOne({
      where: { profesor_id: id },
      relations: ['persona'],
    });
    if (!profesor) throw new NotFoundException('Profesor no encontrado');

    profesor.persona.activo = false;
    return this.personaRepository.save(profesor.persona);
  }
}
