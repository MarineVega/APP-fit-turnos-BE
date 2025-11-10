import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Post()
  create(@Body() createActividadDto: CreateActividadDto) {
    return this.actividadesService.create(createActividadDto);
  }

  @Get()
  findAll() {
    return this.actividadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actividadesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateActividadDto: UpdateActividadDto) {
    return this.actividadesService.update(+id, updateActividadDto);
  }  
/*
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActividadDto: UpdateActividadDto) {
    return this.actividadesService.update(+id, updateActividadDto);
  }
*/
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actividadesService.delete(+id);
  }
}
