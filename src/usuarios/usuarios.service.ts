import { Injectable, NotFoundException, HttpStatus, HttpException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  private usuarios : Usuario[] = [];

  constructor(@InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Obtener todos los usuarios
  public async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  // Obtener un usuario por ID
  public async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { usuario_id: id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

  // Crear un nuevo usuario
  public async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {     
      let usuario : Usuario = await this.usuarioRepository.save( new Usuario (createUsuarioDto.tipoUsuario_id, createUsuarioDto.usuario, createUsuarioDto.activo) );

      if (usuario)
        return await this.usuarioRepository.save(usuario);
      else 
        //throw new Exception('No se pudo crear el usuario');
        console.log('Error!!!!!!!!! No se pudo crear el usuario');
        throw new BadRequestException('No se pudo crear el usuario');

    } catch (error) {        
        throw new HttpException( { status : HttpStatus.NOT_FOUND, 
        error : 'Error en la creacion del usuario ' + error}, HttpStatus.NOT_FOUND );      
    }
  }

  // Actualizar un usuario  
  public async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    try {
      let usuario = await this.findOne(id);

      if (updateUsuarioDto.tipoUsuario_id !== undefined) {
        usuario.setTipoUsuario_id(updateUsuarioDto.tipoUsuario_id);
      }
      if (updateUsuarioDto.usuario !== undefined) {
        usuario.setUsuario(updateUsuarioDto.usuario);
      }
      if (updateUsuarioDto.activo!== undefined) {
        usuario.setActivo(updateUsuarioDto.activo);
      }
      usuario = await this.usuarioRepository.save(usuario);
      
      if (!usuario)
        throw new BadRequestException('No se pudo modificar el usuario');
      else        
        return usuario;
        
    } catch (error) {
      throw new HttpException( { status : HttpStatus.NOT_FOUND,
      error : 'Error en la actualización del usuario ' + error}, HttpStatus.NOT_FOUND);
    }
  }


  // Eliminar un usuario
  public async delete(id : number) : Promise<boolean> {
    try {
      let usuario = await this.findOne(id);    
      
      if (!usuario)
        throw new BadRequestException('No se encuentra el usuario');
      else
        await this.usuarioRepository.delete({usuario_id:id});
        return true;
    } catch (error) {
      throw new HttpException( { status : HttpStatus.NOT_FOUND,
      error : 'Error en la eliminación del usuario ' + error}, HttpStatus.NOT_FOUND);
    }
  }

}

