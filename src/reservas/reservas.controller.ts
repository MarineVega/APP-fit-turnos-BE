import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservasService.create(createReservaDto);
  }

  @Get()
  findAll() {
    return this.reservasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservasService.findOne(+id);
  }
/*
  @Put(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservasService.update(+id, updateReservaDto);
  }
    */
  /*
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservasService.update(+id, updateReservaDto);
  }
*/
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.reservasService.delete(+id);
  }
}
