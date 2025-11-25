// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from 'src/mail/mail.module';
import { ClientesModule } from '../clientes/clientes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 🔹 Para leer variables .env
    UsuariosModule, // 🔹 Importante para usar UsuariosService
    PassportModule,
    MailModule,
    ClientesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'clavePorDefecto',
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || '1d' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
