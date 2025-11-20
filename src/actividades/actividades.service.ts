import { 
  BadRequestException, 
  HttpException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';
import { Actividad } from './entities/actividad.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { Horario } from 'src/horarios/entities/horario.entity';

@Injectable()
export class ActividadesService {  
  constructor(
    @InjectRepository(Actividad)
      private readonly actividadRepository: Repository<Actividad>,

    @InjectRepository(Reserva)
      private readonly reservaRepository: Repository<Reserva>,

    @InjectRepository(Horario)
      private readonly horarioRepository: Repository<Horario>,
  ) {}

  private async tieneReservasActivas(actividad_id: number): Promise<boolean> {
    const reservas = await this.reservaRepository.count({
      where: { 
        actividad: { actividad_id },
        activo: true
      },
    });
    return reservas > 0;
  }

  private async tieneHorariosActivos(actividad_id: number): Promise<boolean> {
    const horarios = await this.horarioRepository.count({
      where: { 
        actividad: { actividad_id },
        activo: true
      },
    });
    return horarios > 0;
  }

  // --------------------------------------------------------------------
  // Obtengo todas las actividades
  // --------------------------------------------------------------------
  public async findAll(): Promise<Actividad[]> {
    return await this.actividadRepository.find();
  }

  // --------------------------------------------------------------------
  // Obtengo una actividad por ID
  // --------------------------------------------------------------------
  public async findOne(id: number): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({ where: { actividad_id: id } });

    if (!actividad) throw new NotFoundException(`Actividad con id ${id} no encontrada`);

    return actividad;
  }

  // --------------------------------------------------------------------
  // Creo una actividad
  // --------------------------------------------------------------------
  public async create(createActividadDto: CreateActividadDto): Promise<Actividad> {
    try {
      // Valido nombre duplicado
      const yaExiste = await this.actividadRepository.findOne({
        where: { nombre: createActividadDto.nombre.trim() }
      });

      if (yaExiste) throw new BadRequestException(`Ya existe una actividad con el nombre "${createActividadDto.nombre}".`);
      
      let actividad : Actividad = await this.actividadRepository.save( 
        new Actividad (
          createActividadDto.nombre, 
          createActividadDto.descripcion, 
          createActividadDto.cupoMaximo, 
          createActividadDto.imagen,
          createActividadDto.activa
        ) 
      );

      if (!actividad) throw new BadRequestException('No se pudo crear la actividad');
      
      return actividad;
    
    } catch (error) { 
        if (error instanceof HttpException) throw error;
        console.error("ERROR EN create():", error);

        throw new InternalServerErrorException("Ocurrió un error inesperado al crear la actividad.");    
    }
  }

  // --------------------------------------------------------------------
  // Actualizo actividad
  // --------------------------------------------------------------------
  public async update(id: number, updateActividadDto: UpdateActividadDto): Promise<Actividad> {
    try {
      let actividad = await this.findOne(id);
      if (!actividad) throw new NotFoundException(`Actividad con id ${id} no encontrada.`);

      // No permito modificar si tiene reservas activa
      if (await this.tieneReservasActivas(id)) throw new BadRequestException('No se puede modificar la actividad porque tiene reservas activas.');

      // No permito modificar si tiene horarios activos
      if (await this.tieneHorariosActivos(id)) throw new BadRequestException('No se puede modificar la actividad porque tiene horarios activos.');

      // Validación de nombre duplicado
      if (updateActividadDto.nombre) {
        const yaExiste = await this.actividadRepository.findOne({
          where: { nombre: updateActividadDto.nombre.trim() }
        });

        if (yaExiste && yaExiste.actividad_id !== id) throw new BadRequestException(`Ya existe otra actividad con el nombre "${updateActividadDto.nombre}".`);        
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
      if (error instanceof HttpException) throw error;
      console.error("ERROR EN update():", error);

      throw new InternalServerErrorException("Ocurrió un error inesperado al modificar la actividad.");
    }
  }
    
  // --------------------------------------------------------------------
  // Elimino una actividad
  // --------------------------------------------------------------------
  public async delete(id : number) : Promise<boolean> {
    try {
      const actividad = await this.findOne(id);
      if (!actividad) throw new NotFoundException(`Actividad con id ${id} no encontrada.`);

       // No permito eliminar si tiene reservas activa
      if (await this.tieneReservasActivas(id)) throw new BadRequestException('No se puede eliminar la actividad porque tiene reservas activas.');

      // No permito eliminar si tiene horarios activos
      if (await this.tieneHorariosActivos(id)) throw new BadRequestException('No se puede eliminar la actividad porque tiene horarios activos.');

      await this.actividadRepository.delete({ actividad_id:id });
      return true;

    } catch (error) {      
      if (error instanceof HttpException) throw error;
      console.error("ERROR EN delete():", error);

      throw new InternalServerErrorException("Ocurrió un error inesperado al eliminar la actividad.");
    }
  }
}