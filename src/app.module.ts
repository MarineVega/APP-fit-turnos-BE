import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 🔹 Import ConfigModule
import { UsuariosModule } from './usuarios/usuarios.module';
import { ActividadesModule } from './actividades/actividades.module';
import { HorariosModule } from './horarios/horarios.module';
import { HorasModule } from './horas/horas.module';
import { ReservasModule } from './reservas/reservas.module';
import { AuthModule } from './auth/auth.module';
import { ProfesoresModule } from './profesores/profesores.module';
import { MailModule } from './mail/mail.module';
import { ClientesModule } from './clientes/clientes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 🔹 Habilita variables env en toda la app
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
     // useFactory: (configService: ConfigService) => ({
      
      useFactory: (configService: ConfigService) => {
        // LOG para saber que BD se está usando
        console.log('🟢 DATABASE CONFIG:');
        console.log({
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          user: configService.get('DB_USER'),
          database: configService.get('DB_NAME'),
        });

        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: Number(configService.get<string>('DB_PORT')),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: ["dist/**/**.entity{.ts,.js}"],
          synchronize: false, // ⚠ esto debe quedar en false en producción
          extra: {
            connectionLimit: 4, // Establece un límite de seguridad menor al límite de Clever Cloud (5)
          },
     // }),
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    UsuariosModule,
    ActividadesModule,
    HorariosModule,
    HorasModule,
    ReservasModule,
    AuthModule,
    ProfesoresModule,
    MailModule,
    ClientesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
