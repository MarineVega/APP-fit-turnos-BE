import { Module } from '@nestjs/common';
import { HorasService } from './horas.service';
import { HorasController } from './horas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hora } from './entities/hora.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Hora])],
  controllers: [HorasController],
  providers: [HorasService],
})
export class HorasModule {}
