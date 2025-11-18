import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { Actividad } from 'src/actividades/entities/actividad.entity';
import { Profesor } from 'src/profesores/entities/profesor.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Horario } from 'src/horarios/entities/horario.entity';

@Injectable()
export class ReservasService {

  constructor(  
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,

    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,

    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,    
    ) {}
  

    // Obtengo todas las reservas
    public async findAll(): Promise<Reserva[]> {
    
    const reservas = await this.reservaRepository.find({
      relations: ['actividad', 'horario'],           // omito profesor y cliente por ahora
      //relations: ['actividad', 'profesor', 'cliente', 'horario']
    });

    // harcodeo un "nombre de profesor" para no romper el front
    return reservas.map((h) => ({
      ...h,
      profesor: {
        profesor_id: h.getProfesor()?.profesor_id ?? 0,
        nombre: 'Prueba',
        apellido: 'Demo',
      },
    })) as any;
  }

  // Obtengo una reserva por ID
  public async findOne(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({ where: { reserva_id: id } });
    
    if (!reserva) {
      throw new NotFoundException(`Reserva con id ${id} no encontrado`);
    }
    return reserva;
  }

  // Creo una nueva reserva
  public async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
    try {

      const reservasExistentes = await this.reservaRepository.find({
        relations: ['actividad', 'profesor', 'cliente' ,'horario']
      });

      // Validar que no reserve el mismo día y hora de una existente
      
      const { actividad_id, profesor_id, cliente_id, horario_id, fecha, activo } = createReservaDto;

      const actividad = await this.actividadRepository.findOne({ where: { actividad_id } });
      if (!actividad) throw new BadRequestException(`Actividad con id ${actividad_id} no encontrada.`);
      
      const profesor = await this.profesorRepository.findOne({ where: { profesor_id } });
      if (!profesor) throw new BadRequestException(`Profesor con id ${profesor_id} no encontrado.`);

      const cliente = await this.clienteRepository.findOne({ where: { cliente_id } });
      if (!cliente) throw new BadRequestException(`Cliente con id ${cliente_id} no encontrado.`);

      const horario = await this.horarioRepository.findOne({ where: { horario_id } });
      if (!horario) throw new BadRequestException(`Horario con id ${horario_id} no encontrado.`);

      let reserva : Reserva = await this.reservaRepository.save(
        new Reserva (
          actividad, 
          profesor, 
          cliente,          
          horario, 
          fecha,
          activo
        )
      );

      if (!reserva) {
        throw new BadRequestException('No se pudo registrar la reserva.');
      }

      return reserva;

    } catch (error) {
      if (error instanceof HttpException) throw error;      
      throw new InternalServerErrorException(
          "Ocurrió un error inesperado al registrar la reserva."
      );
    }
  }
    
  // Cancelar una reserva
  public async delete(id: number): Promise<boolean> {
    try {
      const reserva = await this.findOne(id);
      if (!reserva) throw new BadRequestException('No se encuentra la reserva');

      await this.reservaRepository.delete({ reserva_id: id });
      return true;

    } catch (error) {
      console.error("ERROR EN delete():", error);

      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Ocurrió un error inesperado al cancelar la reserva."
      );
    }
  }   


}
