import { Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from './entities/actividad.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { Horario } from 'src/horarios/entities/horario.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Actividad, Reserva, Horario])],
  controllers: [ActividadesController],
  providers: [ActividadesService],
})
export class ActividadesModule {}
