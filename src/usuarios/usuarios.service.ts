import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario';
import * as bcrypt from 'bcrypt';

// IMPORTANTE
import { ClientesService } from 'src/clientes/clientes.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    private readonly clientesService: ClientesService,
  ) {}

  // ---------------------------------------------
  // Limpieza de campos vacíos
  // ---------------------------------------------
  private clean(obj: any) {
    if (!obj) return obj;
    const cleaned = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value === '' || value === null || value === undefined) continue;
      cleaned[key] = value;
    }

    return cleaned;
  }

  // ---------------------------------------------
  // Crear usuario (crea persona por cascade)
  // ---------------------------------------------
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const nuevoUsuario = this.usuarioRepository.create({
      usuario: createUsuarioDto.usuario,
      email: createUsuarioDto.email,
      password: createUsuarioDto.password, // ya hasheada

      verificado: createUsuarioDto.verificado ?? 0,
      verification_token: createUsuarioDto.verification_token ?? null,

      persona: this.clean(createUsuarioDto.persona),
    });

    const saved = await this.usuarioRepository.save(nuevoUsuario);

    // Crear cliente si la persona es tipo 3
    if (saved.persona && saved.persona.tipoPersona_id === 3) {
      await this.clientesService.createFromPersona(saved.persona.persona_id);
    }

    const { password, ...rest } = saved as any;
    return rest as Usuario;
  }

  // ---------------------------------------------
  // Obtener todos
  // ---------------------------------------------
  async findAll(): Promise<Usuario[]> {
    const users = await this.usuarioRepository.find({
      relations: ['persona'],
    });

    return users.map((u) => {
      const { password, ...rest } = u as any;
      return rest as Usuario;
    });
  }

  // ---------------------------------------------
  // Obtener uno por id (sin password)
  // ---------------------------------------------
  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { usuario_id: id },
      relations: ['persona'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const { password, ...rest } = usuario as any;
    return rest;
  }

  // ---------------------------------------------
  // Buscar por email
  // ---------------------------------------------
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

  // ---------------------------------------------
  // Buscar por username
  // ---------------------------------------------
  async findByUsername(username: string, includePassword = false): Promise<Usuario | null> {
    const user = await this.usuarioRepository.findOne({
      where: { usuario: username },
      relations: ['persona'],
    });

    if (!user) return null;
    if (includePassword) return user;

    const { password, ...rest } = user as any;
    return rest as Usuario;
  }

  // ---------------------------------------------
  // Buscar por token de verificación
  // ---------------------------------------------
  async findByVerificationToken(token: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { verification_token: token },
      relations: ['persona'],
    });
  }

  // ---------------------------------------------
  // Buscar usuario con password (para login)
  // ---------------------------------------------
  async findByIdWithPassword(id: number): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { usuario_id: id },
      relations: ['persona'],
    });
  }

  // ---------------------------------------------
  // Actualizar usuario
  // ---------------------------------------------
  async update(id: number, updateDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { usuario_id: id },
      relations: ['persona'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    if (updateDto.usuario !== undefined) usuario.usuario = updateDto.usuario;
    if (updateDto.email !== undefined) usuario.email = updateDto.email;

    if (updateDto.password !== undefined) {
      const hashed = await bcrypt.hash(updateDto.password, 10);
      usuario.password = hashed;
    }

    if (updateDto.verificado !== undefined) usuario.verificado = updateDto.verificado;
    if (updateDto.verification_token !== undefined)
      usuario.verification_token = updateDto.verification_token;

    if (updateDto.persona) {
      usuario.persona = {
        ...usuario.persona,
        ...this.clean(updateDto.persona),
      };
    }

    const saved = await this.usuarioRepository.save(usuario);

    const { password, ...rest } = saved as any;
    return rest as Usuario;
  }

  // ---------------------------------------------
  // Eliminar usuario (CORREGIDO)
  // ---------------------------------------------
  async remove(id: number): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { usuario_id: id },
      relations: ['persona'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const persona = usuario.persona;

    if (!persona) {
      throw new BadRequestException('El usuario no tiene persona asociada');
    }

    // 📌 Si es CLIENTE (tipoPersona_id = 3), validar reservas
    if (persona.tipoPersona_id === 3) {
      const cliente = await this.clientesService.findByPersonaId(persona.persona_id);

      if (!cliente) {
        throw new BadRequestException(
          'El usuario es cliente pero no tiene registro en la tabla clientes',
        );
      }

      // ⛔ VALIDACIÓN QUE FALLABA → YA ESTÁ CORREGIDA
      const tieneReservas = await this.clientesService.clienteTieneReservas(
        cliente.cliente_id,
      );

      if (tieneReservas) {
        throw new BadRequestException(
          'No se puede eliminar un cliente porque tiene reservas registradas',
        );
      }

      // ✔ Eliminar cliente + usuario + persona
      await this.clientesService.removeByPersonaId(persona.persona_id);

      return;
    }

    // 📌 Si NO es cliente → eliminar persona y usuario

    // eliminar PERSONA
    await this.usuarioRepository.manager.delete('persona', {
      persona_id: persona.persona_id,
    });

    // eliminar USUARIO
    await this.usuarioRepository.remove(usuario);
  }

  // ---------------------------------------------
  // Cambiar contraseña
  // ---------------------------------------------
  async cambiarPassword(id: number, actual: string, nueva: string) {
    const usuario = await this.findByIdWithPassword(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const ok = await bcrypt.compare(actual, usuario.password);
    if (!ok) throw new BadRequestException('La contraseña actual es incorrecta');

    const hashed = await bcrypt.hash(nueva, 10);
    usuario.password = hashed;

    await this.usuarioRepository.save(usuario);

    return { message: 'Contraseña actualizada correctamente' };
  }

  // ---------------------------------------------
  // Actualizar contraseña (usado desde AuthService)
  // ---------------------------------------------
  async updatePassword(id: number, hashedPassword: string) {
    const usuario = await this.findByIdWithPassword(id);

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    usuario.password = hashedPassword;

    await this.usuarioRepository.save(usuario);

    return { message: 'Contraseña actualizada correctamente' };
  }

  // ---------------------------------------------
  // Verificar cuenta
  // ---------------------------------------------
  async verifyUser(token: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { verification_token: token },
    });

    if (!usuario) {
      throw new BadRequestException('Token inválido o expirado');
    }

    usuario.verificado = 1;
    usuario.verification_token = null;

    const saved = await this.usuarioRepository.save(usuario);

    const { password, ...rest } = saved as any;
    return rest;
  }
}
