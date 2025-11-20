import { Module } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { HorariosController } from './horarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horario } from './entities/horario.entity';
import { Hora } from 'src/horas/entities/hora.entity';
import { Actividad } from 'src/actividades/entities/actividad.entity';
import { Profesor } from 'src/profesores/entities/profesor.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Horario, Actividad, Profesor, Hora, Reserva])],
  controllers: [HorariosController],
  providers: [HorariosService],
})
export class HorariosModule {}
