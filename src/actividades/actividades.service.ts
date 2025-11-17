import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';
import { Actividad } from './entities/actividad.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ActividadesService {
  
  constructor(
    @InjectRepository(Actividad)
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

       // Validación de nombre duplicado
      const yaExiste = await this.actividadRepository.findOne({
        where: { nombre: createActividadDto.nombre.trim() }
      });

      if (yaExiste) {
        throw new BadRequestException(
          `Ya existe una actividad con el nombre "${createActividadDto.nombre}".`
        );
      }

      let actividad : Actividad = await this.actividadRepository.save( 
        new Actividad (
          createActividadDto.nombre, 
          createActividadDto.descripcion, 
          createActividadDto.cupoMaximo, 
          createActividadDto.imagen,
          createActividadDto.activa
        ) 
      );

      if (!actividad){
        throw new BadRequestException('No se pudo crear la actividad');
      }

      return actividad;
    
    } catch (error) { 
      console.error("ERROR EN create():", error);

      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Ocurrió un error inesperado al crear la actividad."
      );    
    }
  }

  // Actualizar una actividad
  public async update(id: number, updateActividadDto: UpdateActividadDto): Promise<Actividad> {
    try {

      let actividad = await this.findOne(id);
      if (!actividad) throw new BadRequestException('No se encuentra la actividad');

      // Validación de nombre duplicado
      if (updateActividadDto.nombre) {
        const yaExiste = await this.actividadRepository.findOne({
          where: { nombre: updateActividadDto.nombre.trim() }
        });

        if (yaExiste && yaExiste.actividad_id !== id) {
          throw new BadRequestException(
            `Ya existe otra actividad con el nombre "${updateActividadDto.nombre}".`
          );
        }
      }

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
      console.error("ERROR EN update():", error);

      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Ocurrió un error inesperado al modificar la actividad."
      );
    }
  }
    
  // Eliminar una actividad
  public async delete(id : number) : Promise<boolean> {
    try {
      const actividad = await this.findOne(id);
      if (!actividad) throw new BadRequestException('No se encuentra la actividad');

      await this.actividadRepository.delete({actividad_id:id});
      return true;

    } catch (error) {
      console.error("ERROR EN delete():", error);

      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Ocurrió un error inesperado al eliminar la actividad."
      );
    }
  }

}