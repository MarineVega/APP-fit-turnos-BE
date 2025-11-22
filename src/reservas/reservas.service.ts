import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
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

    // --------------------------------------------------------------------
    // Obtengo todas las reservas
    // --------------------------------------------------------------------
    public async findAll(): Promise<Reserva[]> {
        return await this.reservaRepository.find({
           relations: ['actividad', 'profesor', 'cliente', 'horario'],
        });
    }

    // --------------------------------------------------------------------
    // Obtengo una reserva por ID
    // --------------------------------------------------------------------
    public async findOne(id: number): Promise<Reserva> {
        const reserva = await this.reservaRepository.findOne({
            where: { reserva_id: id },
            relations: ['actividad', 'profesor', 'cliente', 'horario'],
        });

        if (!reserva) throw new NotFoundException(`Reserva con id ${id} no encontrada.`);

        return reserva;
    }

    // --------------------------------------------------------------------
    // Creo una nueva reserva
    // --------------------------------------------------------------------
    public async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
        try {
            const { actividad_id, profesor_id, cliente_id, horario_id, fecha, activo } = 
            createReservaDto;

            // 1 - Valido existencia de los IDs
            const actividad = await this.actividadRepository.findOne({ 
                where: { 
                    actividad_id,
                    activa: true
                } 
            });
            if (!actividad) throw new NotFoundException(`Actividad con id ${actividad_id} no encontrada o está desactivada.`);
                        
            let profesor: Profesor | null = null;       // Profesor opcional

            if (profesor_id) {
                profesor = await this.profesorRepository.findOne({ 
                    where: { 
                        profesor_id,
                        persona: { activo: true }
                        },
                    relations: ['persona']
                });

                if (!profesor) throw new NotFoundException(`Profesor con id ${profesor_id} no encontrado o está desactivado.`);
            }

            // Valido existencia de cliente
            const cliente = await this.clienteRepository.findOne({
                where: { 
                    cliente_id,
                    persona: { activo: true }
                },
                relations: ['persona']
            });

            if (!cliente) throw new NotFoundException(`Cliente con id ${cliente_id} no encontrado o está desactivado.`);

            // Valido existencia de horario
            const horario = await this.horarioRepository.findOne({ 
                where: { 
                    horario_id,
                    activo: true
                }, 
            });
            if (!horario) throw new NotFoundException(`Horario con id ${horario_id} no encontrado o está desactivado.`);

            // Valido solapamiento: mismo cliente, misma fecha y misma hora
            const reservasCliente = await this.reservaRepository.find({
                where: {
                    cliente: { cliente_id },
                    fecha,
                    activo: true
                },
                relations: ['horario', 'horario.hora']
            });

            // horario ya fue obtenido arriba
            const hora_id = horario.getHora().hora_id;

            const conflicto = reservasCliente.some(r =>
                r.getHorario()?.getHora()?.hora_id === hora_id
            );
            
           if (conflicto) throw new BadRequestException(`El cliente ya tiene una reserva en este mismo horario y fecha.`); 

            // Creo y guardo
            const reserva = await this.reservaRepository.save(
                new Reserva (
                    actividad, 
                    profesor, 
                    cliente, 
                    horario, 
                    fecha, 
                    activo)
            );

            if (!reserva) throw new BadRequestException('No se pudo registrar la reserva.');      

            return reserva;

        } catch (error) {
            if (error instanceof HttpException) throw error;
            console.error('ERROR EN create():', error);

            throw new InternalServerErrorException('Ocurrió un error inesperado al registrar la reserva.');
        }
    }

    // --------------------------------------------------------------------
    // Elimino (cancelar reserva)
    // --------------------------------------------------------------------
    public async delete(id: number): Promise<boolean> {
        try {
            const reserva = await this.findOne(id);
            if (!reserva) throw new NotFoundException(`Reserva con id ${id} no encontrada.`);
            
            await this.reservaRepository.delete({ reserva_id: id });
            return true;

        } catch (error) {
            if (error instanceof HttpException) throw error;
            console.error('ERROR EN delete():', error);

            throw new InternalServerErrorException('Ocurrió un error inesperado al cancelar la reserva.');
        }
    }
}

/*
  1. Errores HTTP
  ✔️ 400 – BadRequestException
Lo uso cuando:
- El cliente ya tiene una reserva ese dia y hora
Está bien porque el problema viene de lo que envía el usuario.

 ✔️ 404 – NotFoundException
Lo uso cuando:
- Falta o no existe actividad, profesor, cliente, horario
- No se puede crear la reserva
- El ID proporcionado no corresponde a un recurso existente
- No encuentra la reserva con el ID enviado


✔️ 500 – InternalServerErrorException
Solo se usa para errores inesperados que no provienen del usuario.

*/
