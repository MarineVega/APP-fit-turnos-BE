import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✅ Registro
  @Post('register')
  async register(@Body() data: any) {
    return this.authService.register(data);
  }

  // ✅ Login
  @Post('login')
  async login(@Body() data: { email: string; password: string }) {
    return this.authService.login(data.email, data.password);
  }

  //  Validar token y usuario activo
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async perfil(@Req() req) {
    return req.user;
  }

  // Cambiar contraseña estando autenticado
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const usuarioId = req.user?.usuario_id;
    return this.authService.changePassword(
      usuarioId,
      body.currentPassword,
      body.newPassword,
    );
  }

  // Restablecer contraseña con email (sin autenticación)
  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; password: string }) {
    return this.authService.resetPassword(body.email, body.password);
  }
}
