import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';
import { Actividad } from './entities/actividad.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ActividadesService {
  private actividades : Actividad[] = [];

  constructor(@InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
  ) {}

  // Obtengo todos las actividades
  public async findAll(): Promise<Actividad[]> {
    return await this.actividadRepository.find();
  }

  // Obtengo una actividad por ID
  public async findOne(id: number): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({ where: { actividad_id: id } });
    if (!actividad) {
      throw new NotFoundException(`Actividad con id ${id} no encontrada`);
    }
    return actividad;
  }

  // Creo una nueva actividad
  public async create(createActividadDto: CreateActividadDto): Promise<Actividad> {
    try {     
      let actividad : Actividad = await this.actividadRepository.save( 
        new Actividad (
          createActividadDto.nombre, 
          createActividadDto.descripcion, 
          createActividadDto.cupoMaximo, 
          createActividadDto.imagen,
          createActividadDto.activa
        ) 
      );

      if (actividad)
        return await this.actividadRepository.save(actividad);
      else         
        console.log('Error!!!!!!!!! No se pudo crear la actividad');
        throw new BadRequestException('No se pudo crear la actividad');

    } catch (error) {        
        throw new HttpException( { status : HttpStatus.NOT_FOUND, 
        error : 'Error en la creacion de la actividad ' + error}, HttpStatus.NOT_FOUND );      
    }
  }

  // Actualizar una actividad
  public async update(id: number, updateActividadDto: UpdateActividadDto): Promise<Actividad> {
    try {
      let actividad = await this.findOne(id);

      if (updateActividadDto.nombre !== undefined) {
        actividad.setNombre(updateActividadDto.nombre);
      }
      if (updateActividadDto.descripcion !== undefined) {
        actividad.setDescripcion(updateActividadDto.descripcion);
      }      
      if (updateActividadDto.cupoMaximo !== undefined) {
        actividad.setCupoMaximo(updateActividadDto.cupoMaximo);
      }
      if (updateActividadDto.imagen !== undefined) {
        actividad.setImagen(updateActividadDto.imagen);
      }
      if (updateActividadDto.activa!== undefined) {
        actividad.setActiva(updateActividadDto.activa);
      }
      actividad = await this.actividadRepository.save(actividad);
      
      if (!actividad)
        throw new BadRequestException('No se pudo modificar la actividad');
      else        
        return actividad;
        
    } catch (error) {
      throw new HttpException( { status : HttpStatus.NOT_FOUND,
      error : 'Error en la actualización de la actividad ' + error}, HttpStatus.NOT_FOUND);
    }
  }
    
  // Eliminar una actividad
  public async delete(id : number) : Promise<boolean> {
    try {
      let actividad = await this.findOne(id);    
      
      if (!actividad)
        throw new BadRequestException('No se encuentra la actividad');
      else
        await this.actividadRepository.delete({actividad_id:id});
        return true;
    } catch (error) {
      throw new HttpException( { status : HttpStatus.NOT_FOUND,
      error : 'Error en la eliminación de la actividad ' + error}, HttpStatus.NOT_FOUND);
    }
  }

}