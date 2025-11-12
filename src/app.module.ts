import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ActividadesModule } from './actividades/actividades.module';
import { HorariosModule } from './horarios/horarios.module';
import { HorasModule } from './horas/horas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '75JbujHB3',
      database: 'fit_turnos', 
      entities:[
        "dist/**/**.entity{.ts,.js}"
      ],
      synchronize: false
    }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname,'..','client') }),
    UsuariosModule,
    ActividadesModule,
    HorariosModule,
    HorasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

