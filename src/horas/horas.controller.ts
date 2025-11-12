import { Controller, Get, Param } from '@nestjs/common';
import { HorasService } from './horas.service';

@Controller('horas')
export class HorasController {
  constructor(private readonly horasService: HorasService) {}

  @Get()
  findAll() {
    return this.horasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.horasService.findOne(+id);
  } 
}

/*
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HorasService } from './horas.service';
import { CreateHoraDto } from './dto/create-hora.dto';
import { UpdateHoraDto } from './dto/update-hora.dto';

@Controller('horas')
export class HorasController {
  constructor(private readonly horasService: HorasService) {}

  @Post()
  create(@Body() createHoraDto: CreateHoraDto) {
    return this.horasService.create(createHoraDto);
  }

  @Get()
  findAll() {
    return this.horasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.horasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHoraDto: UpdateHoraDto) {
    return this.horasService.update(+id, updateHoraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.horasService.remove(+id);
  }
}
*/