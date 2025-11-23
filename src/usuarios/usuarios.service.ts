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
      password: createUsuarioDto.password,

      verificado: createUsuarioDto.verificado ?? 0,
      verification_token: createUsuarioDto.verification_token ?? null,

      persona: this.clean(createUsuarioDto.persona),
    });

    const saved = await this.usuarioRepository.save(nuevoUsuario);

    // Si se crea como cliente, generar entrada en clientes
    if (saved.persona && saved.persona.tipoPersona_id === 3) {
      const existe = await this.clientesService.findByPersonaId(
        saved.persona.persona_id,
      );

      if (!existe) {
        await this.clientesService.createFromPersona(saved.persona.persona_id);
      }
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
  async findOne(id: number): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({
      where: { usuario_id: id },
      relations: ['persona'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    // ---------------------------------------------------------
    // SABER SI EL USUARIO ES CLIENTE Y SI TIENE RESERVAS
    // ---------------------------------------------------------
    let tieneReservas = false;
    let cliente_id: number | null = null;

    if (usuario.persona?.tipoPersona_id === 3) {
      const cliente = await this.clientesService.findByPersonaId(
        usuario.persona.persona_id,
      );

      if (cliente) {
        cliente_id = cliente.cliente_id;

        tieneReservas = await this.clientesService.clienteTieneReservas(
          cliente.cliente_id,
        );
      }
    }

    // ---------------------------------------------------------
    // ARMAR RESPUESTA  PARA EL FRONT
    // ---------------------------------------------------------
    const { password, ...rest } = usuario as any;

    return {
      ...rest,
      cliente_id,
      tieneReservas,
    };
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

    // ---------------------------------------------------------
    // VALIDACIÓN CLIENTE (3) → ADMIN (1)
    // NO PERMITIR SI TIENE RESERVAS
    // ---------------------------------------------------------
    if (
      usuario.persona.tipoPersona_id === 3 && // Es cliente ahora
      updateDto.persona?.tipoPersona_id === 1 // Quiere pasar a admin
    ) {
      const cliente = await this.clientesService.findByPersonaId(
        usuario.persona.persona_id,
      );

      if (cliente) {
        const tieneReservas = await this.clientesService.clienteTieneReservas(
          cliente.cliente_id,
        );

        if (tieneReservas) {
          throw new BadRequestException(
            'No se puede cambiar a ADMIN: el usuario es CLIENTE y tiene reservas registradas.',
          );
        }
      }
    }

    // ---------------------------------------------------------
    // CAMBIO → TIPO 3 (CLIENTE)
    // Si no tiene registro en clientes, crearlo
    // ---------------------------------------------------------
    if (
      usuario.persona.tipoPersona_id !== 3 && // Antes no era cliente
      updateDto.persona?.tipoPersona_id === 3 // Ahora sí
    ) {
      const existe = await this.clientesService.findByPersonaId(
        usuario.persona.persona_id,
      );

      if (!existe) {
        await this.clientesService.createFromPersona(usuario.persona.persona_id);
      }
    }

    // ---------------------------------------------
    // Actualizar campos simples
    // ---------------------------------------------
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
  // Eliminar usuario
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

    if (persona.tipoPersona_id === 3) {
      const cliente = await this.clientesService.findByPersonaId(persona.persona_id);

      if (!cliente) {
        throw new BadRequestException(
          'El usuario es cliente pero no tiene registro en la tabla clientes',
        );
      }

      const tieneReservas = await this.clientesService.clienteTieneReservas(
        cliente.cliente_id,
      );

      if (tieneReservas) {
        throw new BadRequestException(
          'No se puede eliminar un cliente porque tiene reservas registradas',
        );
      }

      await this.clientesService.removeByPersonaId(persona.persona_id);
      return;
    }

    await this.usuarioRepository.manager.delete('persona', {
      persona_id: persona.persona_id,
    });

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
  // Actualizar contraseña (AuthService)
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
