import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesoresService } from './profesores.service';
import { ProfesoresController } from './profesores.controller';
import { Profesor } from './entities/profesor.entity';
import { Persona } from '../usuarios/entities/persona.entity';

@Module({
  // Incluimos Profesor y Persona porque al crear un profesor también se crea o actualiza una Persona
  imports: [TypeOrmModule.forFeature([Profesor, Persona])],
  controllers: [ProfesoresController],
  providers: [ProfesoresService],
})
export class ProfesoresModule {}
