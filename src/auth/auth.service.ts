import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { MailService } from 'src/mail/mail.service'; // <-- IMPORTANTE

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService, // <-- IMPORTANTE
  ) {}

  // ============================================================
  // REGISTRO + ENVÍO DE EMAIL
  // ============================================================
  async register(data: any) {
    const { usuario, email, password, persona } = data;

    // 1) Email existente
    const emailExistente = await this.usuariosService.findByEmail(email, true);
    if (emailExistente) {
      throw new BadRequestException('El email ya está registrado.');
    }

    // 2) Username existente
    const usernameExistente = await this.usuariosService.findByUsername(usuario);
    if (usernameExistente) {
      throw new BadRequestException('El nombre de usuario ya está en uso.');
    }

    // 3) Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) Token de verificación
    const verificationToken = this.jwtService.sign(
      { email },
      { expiresIn: '24h' },
    );

    // 5) Crear usuario
    const nuevoUsuario = {
      usuario,
      email,
      password: hashedPassword,
      verificado: 0,
      verification_token: verificationToken,
      persona: persona ?? { tipoPersona_id: 3 },
    };

    const creado = await this.usuariosService.create(nuevoUsuario);

    // --------------------------------------------------
    // 🔥 MANDAR EMAIL DE VERIFICACIÓN
    // --------------------------------------------------
    const FRONT_URL = process.env.FRONT_URL || 'http://localhost:5173';
    const url = `${FRONT_URL}/verificar/${verificationToken}`;

    await this.mailService.sendVerificationEmail(email, url);

    return {
      message:
        'Usuario registrado correctamente. Revisá tu correo para verificar la cuenta.',
      usuario: {
        id: creado.usuario_id,
        usuario: creado.usuario,
        email: creado.email,
        persona_id: creado.persona?.persona_id ?? null,
      },
    };
  }

  // ============================================================
  // LOGIN SOLO EMAIL + PASSWORD
  // ============================================================
  async login(email: string, password: string) {
    const usuario = await this.usuariosService.findByEmail(email, true);

    if (!usuario) {
      throw new BadRequestException('El email no existe.');
    }

    if (usuario.verificado !== 1) {
      throw new BadRequestException(
        'Tu cuenta aún no está verificada. Revisá tu correo.',
      );
    }

    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) {
      throw new BadRequestException('Contraseña incorrecta.');
    }

    const payload = {
      sub: usuario.usuario_id,
      email: usuario.email,
      usuario: usuario.usuario,
      rol: usuario.persona?.tipoPersona_id,
    };

    const token = this.jwtService.sign(payload);

    const { password: _p, ...safeUser } = usuario as any;

    return {
      access_token: token,
      usuario: safeUser,
    };
  }

  // ============================================================
  // VERIFICAR CUENTA POR TOKEN
  // ============================================================
  async verifyAccount(token: string) {
    const usuario = await this.usuariosService.findByVerificationToken(token);
    if (!usuario) throw new BadRequestException('Token inválido o expirado.');

    await this.usuariosService.update(usuario.usuario_id, {
      verificado: 1,
      verification_token: null,
    });

    return { message: 'Cuenta verificada correctamente.' };
  }

  // ============================================================
  // CAMBIO DE CONTRASEÑA
  // ============================================================
  async changePassword(
    usuarioId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const usuario = await this.usuariosService.findByIdWithPassword(usuarioId);
    if (!usuario) throw new NotFoundException('Usuario no encontrado.');

    const ok = await bcrypt.compare(currentPassword, usuario.password);
    if (!ok) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.usuariosService.updatePassword(usuarioId, hashed);

    return { message: 'Contraseña actualizada correctamente.' };
  }

  // ============================================================
  // RESET PASSWORD SIN LOGIN
  // ============================================================
  async resetPassword(email: string, newPassword: string) {
    const usuario = await this.usuariosService.findByEmail(email, true);
    if (!usuario)
      throw new NotFoundException('No existe un usuario con ese email.');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.usuariosService.updatePassword(usuario.usuario_id, hashed);

    return { message: 'Contraseña restablecida correctamente.' };
  }

// ============================================================
// ENVIAR CÓDIGO DE RECUPERACIÓN
// ============================================================
async sendRecoveryCode(email: string, codigo: string) {
  const usuario = await this.usuariosService.findByEmail(email, true);

  if (!usuario) {
    throw new NotFoundException('No existe un usuario con ese email.');
  }

  if (!usuario.verificado) {
    throw new BadRequestException(
      'La cuenta no está verificada. No se puede recuperar la contraseña.',
    );
  }

  // Enviar email
  await this.mailService.sendRecoveryCode(email, codigo);

  return { message: 'Código enviado correctamente.' };
}

  // ============================================================
  // REENVIAR EMAIL DE VERIFICACIÓN
  // ============================================================
  async resendVerificationEmail(email: string) {
    const usuario = await this.usuariosService.findByEmail(email, true);
    if (!usuario)
      throw new NotFoundException('No existe una cuenta con ese correo.');

    if (usuario.verificado === 1)
      return { message: 'La cuenta ya está verificada.' };

    const newToken = this.jwtService.sign(
      { email: usuario.email },
      { expiresIn: '24h' },
    );

    await this.usuariosService.update(usuario.usuario_id, {
      verification_token: newToken,
    });

    const FRONT_URL = process.env.FRONT_URL || 'http://localhost:5173';
    const url = `${FRONT_URL}/verificar/${newToken}`;

    await this.mailService.sendVerificationEmail(usuario.email, url);

    return { message: 'Nuevo correo de verificación enviado.' };
  }
}
