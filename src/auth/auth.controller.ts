import {
  Param,
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ============================================================
  // REGISTRO
  // ============================================================
  @Post('register')
  async register(@Body() data: any) {
    if (!data.email || !data.password || !data.usuario) {
      throw new BadRequestException('Faltan datos obligatorios');
    }

    return this.authService.register(data);
  }

  // ============================================================
  // VERIFICAR CUENTA
  // ============================================================
  @Get('verify/:token')
  async verify(@Param('token') token: string) {
    return this.authService.verifyAccount(token);
  }

  // ============================================================
  // LOGIN (SOLO EMAIL + PASSWORD)
  // ============================================================
  @Post('login')
  async login(@Body() data: { email: string; password: string }) {
    const { email, password } = data;

    if (!email || !password) {
      throw new BadRequestException('Email y contraseña son obligatorios');
    }

    return this.authService.login(email, password);
  }

  // ============================================================
  // PERFIL
  // ============================================================
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async perfil(@Req() req) {
    return req.user;
  }

  // ============================================================
  // CAMBIAR CONTRASEÑA (AUTENTICADO)
  // ============================================================
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const usuarioId = req.user?.usuario_id;

    if (!body.currentPassword || !body.newPassword) {
      throw new BadRequestException('Debés enviar ambas contraseñas');
    }

    return this.authService.changePassword(
      usuarioId,
      body.currentPassword,
      body.newPassword,
    );
  }

  // ============================================================
  // RESET PASSWORD SIN LOGIN
  // ============================================================
  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email y nueva contraseña son obligatorios');
    }

    return this.authService.resetPassword(body.email, body.password);
  }

  // ============================================================
  // ENVIAR CÓDIGO DE RECUPERACIÓN
  // ============================================================
  @Post('send-code')
  async sendCode(@Body() body: { email: string; codigo: string }) {
    if (!body.email || !body.codigo) {
      throw new BadRequestException('Email y código son obligatorios');
    }

    return this.authService.sendRecoveryCode(body.email, body.codigo);
  }

  // ============================================================
  // REENVIAR EMAIL DE VERIFICACIÓN
  // ============================================================
  @Post('resend-verification')
  async resendVerification(@Body('email') email: string) {
    if (!email) throw new BadRequestException('Debés enviar el email');

    return this.authService.resendVerificationEmail(email);
  }
}
