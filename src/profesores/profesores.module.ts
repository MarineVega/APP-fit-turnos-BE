import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesoresService } from './profesores.service';
import { ProfesoresController } from './profesores.controller';
import { Profesor } from './entities/profesor.entity';
import { Persona } from '../usuarios/entities/persona.entity';
import { Horario } from '../horarios/entities/horario.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Profesor, Persona, Horario]),
  ],
  controllers: [ProfesoresController],
  providers: [ProfesoresService],
})
export class ProfesoresModule {}
