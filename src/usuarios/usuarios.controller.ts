import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // 🟢 Crear un nuevo usuario
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  // 🟢 Obtener todos los usuarios
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  // 🟢 Obtener un usuario por ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usuariosService.findOne(+id);
  }

  // 🟢 Actualizar un usuario (PUT)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  // 🔴 Eliminar un usuario
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usuariosService.remove(+id);
  }
}
