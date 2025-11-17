import { Actividad } from "src/actividades/entities/actividad.entity";
import { Cliente } from "src/clientes/entities/cliente.entity";
import { Horario } from "src/horarios/entities/horario.entity";
import { Profesor } from "src/profesores/entities/profesor.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('reservas')
export class Reserva {

    @PrimaryGeneratedColumn({ name: 'reserva_id' })
        reserva_id: number;

    @ManyToOne(() => Actividad, { eager: true })    
    @JoinColumn({ name: 'actividad_id' })       
        private actividad: Actividad;
    
    //mocke o “harcodeo” los datos de Profesor para que el sistema no intente hacer el JOIN automáticamente
    @ManyToOne(() => Profesor, { eager: false, nullable: true })
    @JoinColumn({ name: 'profesor_id' })
        private profesor: Profesor;

    //mocke o “harcodeo” los datos del cliente
    @ManyToOne(() => Cliente, { eager: false, nullable: true })
    @JoinColumn({ name: 'cliente_id' })
        private cliente: Cliente;

    @ManyToOne(() => Horario, { eager: true })
    @JoinColumn({ name: 'horario_id' })
        private horario: Horario;

    @Column({ name: 'fecha', type: 'date' })
        private fecha: Date;

    @Column({ name: 'activo', type: 'boolean' })
        private activo: boolean;
    
    constructor (
        actividad: Actividad,
        profesor: Profesor,
        cliente: Cliente,
        horario: Horario,
        fecha: Date,
        activo: boolean
    ) {
        this.actividad = actividad;
        this.profesor = profesor;
        this.cliente = cliente;
        this.horario = horario;
        this.fecha = fecha;
        this.activo = activo;
    }

    public getReserva_id(): number {
        return this.reserva_id;
    }

    public setReserva_id(reserva_id: number): void {
        this.reserva_id = reserva_id;
    }

    public getActividad(): Actividad {
        return this.actividad;
    }

    public setActividad(actividad: Actividad): void {
        this.actividad = actividad;
    }

    public getProfesor(): Profesor {
        return this.profesor;
    }

    public setProfesor(profesor: Profesor): void {
        this.profesor = profesor;
    }

    public getCliente(): Cliente {
        return this.cliente;
    }

    public setCliente(cliente: Cliente): void {
        this.cliente = cliente;
    }

    
    public getHorario(): Horario {
        return this.horario;
    }

    public setHorario(horario: Horario): void {
        this.horario = horario;
    }

    public getFecha(): Date {
        return this.fecha;
    }

    public setFecha(activo: Date): void {
        this.fecha = this.fecha;
    }

    public getActivo(): boolean {
        return this.activo;
    }

    public setActivo(activo: boolean): void {
        this.activo = activo;
    }

}
