import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // 🟢 Crear usuario (AHORA SÍ ENCRIPTA LA CONTRASEÑA)
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

    const nuevoUsuario = this.usuarioRepository.create({
      usuario: createUsuarioDto.usuario,
      email: createUsuarioDto.email,
      password: hashedPassword,   // ✅ contraseña hasheada
      activo: createUsuarioDto.activo ?? true,
      persona: createUsuarioDto.persona,
    });

    const saved = await this.usuarioRepository.save(nuevoUsuario);

    const { password, ...rest } = saved as any;
    return rest as Usuario;
  }

  // 🟢 Obtener todos (sin password)
  async findAll(): Promise<Usuario[]> {
    const users = await this.usuarioRepository.find({ relations: ['persona'] });
    return users.map((u) => {
      const { password, ...rest } = u as any;
      return rest as Usuario;
    });
  }

  // 🟢 Obtener uno (sin password)
  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { usuario_id: id },
      relations: ['persona'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const { password, ...rest } = usuario as any;
    return rest as Usuario;
  }

  // 🟢 Buscar por email (login)
  async findByEmail(email: string, includePassword = false): Promise<Usuario | null> {
    const user = await this.usuarioRepository.findOne({
      where: { email },
      relations: ['persona'],
    });

    if (!user) return null;

    if (includePassword) return user;

    const { password, ...rest } = user as any;
    return rest as Usuario;
  }

  // 🟢 Actualizar usuario
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuarioEntity = await this.usuarioRepository.findOne({
      where: { usuario_id: id },
      relations: ['persona'],
    });

    if (!usuarioEntity) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    if (updateUsuarioDto.usuario !== undefined)
      usuarioEntity.usuario = updateUsuarioDto.usuario;

    if (updateUsuarioDto.email !== undefined)
      usuarioEntity.email = updateUsuarioDto.email;

    if (updateUsuarioDto.password !== undefined) {
      const hashed = await bcrypt.hash(updateUsuarioDto.password, 10);
      usuarioEntity.password = hashed;
    }

    if (updateUsuarioDto.activo !== undefined)
      usuarioEntity.activo = updateUsuarioDto.activo;

    if (updateUsuarioDto.persona) {
      usuarioEntity.persona = { ...usuarioEntity.persona, ...updateUsuarioDto.persona };
    }

    const saved = await this.usuarioRepository.save(usuarioEntity as any);
    const { password, ...rest } = saved as any;
    return rest as Usuario;
  }

  // 🟢 Buscar usuario completo (con password)
  async findByIdWithPassword(id: number): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { usuario_id: id },
      relations: ['persona'],
    });
  }

  // 🔴 Eliminar usuario
  async remove(id: number): Promise<void> {
    const usuario = await this.findByIdWithPassword(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    await this.usuarioRepository.remove(usuario);
  }

  // 🟢 Cambiar contraseña
  async cambiarPassword(id: number, actual: string, nueva: string) {
    const usuario = await this.findByIdWithPassword(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const esCorrecta = await bcrypt.compare(actual, usuario.password);
    if (!esCorrecta) {
      throw new Error('La contraseña actual es incorrecta');
    }

    const hashed = await bcrypt.hash(nueva, 10);
    usuario.password = hashed;

    await this.usuarioRepository.save(usuario);

    return { message: 'Contraseña actualizada correctamente' };
  }

  // 🟢 Actualizar password desde AuthService
  async updatePassword(id: number, hashedPassword: string) {
    const usuario = await this.findByIdWithPassword(id);

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    usuario.password = hashedPassword;
    await this.usuarioRepository.save(usuario);

    return { message: 'Contraseña actualizada correctamente' };
  }
}
