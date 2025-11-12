import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Crea la instancia del usuario con la persona incluida
    const nuevoUsuario = this.usuarioRepository.create({
      usuario: createUsuarioDto.usuario,
      email: createUsuarioDto.email,
      password: createUsuarioDto.password,
      activo: createUsuarioDto.activo ?? true,
      persona: createUsuarioDto.persona, // anidado
    });

    return await this.usuarioRepository.save(nuevoUsuario);
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { usuario_id: id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    // Actualizamos los campos recibidos
    if (updateUsuarioDto.usuario !== undefined)
      usuario.usuario = updateUsuarioDto.usuario;

    if (updateUsuarioDto.email !== undefined)
      usuario.email = updateUsuarioDto.email;

    if (updateUsuarioDto.password !== undefined)
      usuario.password = updateUsuarioDto.password;

    if (updateUsuarioDto.activo !== undefined)
      usuario.activo = updateUsuarioDto.activo;

    // Si viene persona anidada, actualizamos los campos dentro
    if (updateUsuarioDto.persona) {
      usuario.persona = { ...usuario.persona, ...updateUsuarioDto.persona };
    }

    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }
}
