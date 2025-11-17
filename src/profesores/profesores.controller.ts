import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor';

@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  // Crear profesor (crea Persona + Profesor)
  @Post()
  create(@Body() dto: CreateProfesorDto) {
    return this.profesoresService.create(dto);
  }

  // Obtener todos los profesores
  @Get()
  findAll() {
    return this.profesoresService.findAll();
  }

  // Actualizar profesor (tanto su Persona como el Profesor)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfesorDto,
  ) {
    return this.profesoresService.update(id, dto);
  }

  // Eliminar profesor (podés hacer soft delete como lo charlamos)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profesoresService.remove(id);
  }
}
