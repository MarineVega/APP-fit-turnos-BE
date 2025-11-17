import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  //  Login
  async login(email: string, password: string) {
    const user = await this.usuariosService.findByEmail(email, true);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = {
      sub: user.usuario_id,
      email: user.email,
      rol: user.persona?.tipoPersona_id,
    };

    const token = this.jwtService.sign(payload);
    const { password: _pwd, ...usuarioSeguro } = user as any;
    return { access_token: token, usuario: usuarioSeguro };
  }

  //  Registro: encripta contraseña
  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const usuarioConHash = { ...data, password: hashedPassword };
    return this.usuariosService.create(usuarioConHash);
  }

  //  Validar usuario desde token
  async validarUsuario(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return this.usuariosService.findOne(decoded.sub);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  //  Cambiar contraseña estando autenticado
  async changePassword(usuarioId: number, actual: string, nueva: string) {
    const usuario = await this.usuariosService.findByIdWithPassword(usuarioId);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passwordValida = await bcrypt.compare(actual, usuario.password);
    if (!passwordValida) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    const hashed = await bcrypt.hash(nueva, 10);
    await this.usuariosService.updatePassword(usuarioId, hashed);

    return { message: 'Contraseña actualizada correctamente' };
  }

  //  Restablecer contraseña sin autenticación
  async resetPassword(email: string, password: string) {
    const usuario = await this.usuariosService.findByEmail(email, true);

    if (!usuario) {
      throw new UnauthorizedException('No se encontró un usuario con ese email');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usuariosService.updatePassword(usuario.usuario_id, hashedPassword);

    return { message: 'Contraseña restablecida correctamente' };
  }
}
