import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from 'src/actividades/entities/actividad.entity';
import { Horario } from 'src/horarios/entities/horario.entity';
import { Profesor } from 'src/profesores/entities/profesor.entity';
import { Reserva } from './entities/reserva.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Actividad, Profesor, Horario, Cliente])],
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservasModule {}
