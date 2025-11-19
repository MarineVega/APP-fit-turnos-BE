import { Actividad } from "src/actividades/entities/actividad.entity";
import { Cliente } from "src/clientes/entities/cliente.entity";
import { Horario } from "src/horarios/entities/horario.entity";
import { Profesor } from "src/profesores/entities/profesor.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('reservas')
export class Reserva {

    @PrimaryGeneratedColumn({ name: 'reserva_id' })
        reserva_id: number;

    // -------------------------------------------------------------------
    // Relaciones
    // -------------------------------------------------------------------
    
    @ManyToOne(() => Actividad, { eager: true })    
    @JoinColumn({ name: 'actividad_id' })       
        actividad: Actividad;
    
    @ManyToOne(() => Profesor, { eager: false, nullable: true })
    @JoinColumn({ name: 'profesor_id' })
        profesor: Profesor | null;

    @ManyToOne(() => Cliente, { eager: false })
    @JoinColumn({ name: 'cliente_id' })
        cliente: Cliente;

    @ManyToOne(() => Horario, { eager: true })
    @JoinColumn({ name: 'horario_id' })
        horario: Horario;

    // -------------------------------------------------------------------
    // Campos
    // -------------------------------------------------------------------
    @Column({ name: 'fecha', type: 'varchar' })       
       fecha: string;       // formato "YYYY-MM-DD" -> tuve que configurarlo como string porque al guardar lo hacía cambiando la fecha por un día antes

    @Column({ name: 'activo', type: 'boolean' })
        private activo: boolean;
    
    // -------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------
    
    constructor (
        actividad: Actividad,
        profesor: Profesor | null,
        cliente: Cliente,
        horario: Horario,
        fecha: string,
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

    public getProfesor(): Profesor | null {
        return this.profesor;
    }

    public setProfesor(profesor: Profesor | null): void {
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

    public getFecha(): string {
        return this.fecha;
    }

    public setFecha(fecha: string): void {
        this.fecha = fecha;
    }

    public getActivo(): boolean {
        return this.activo;
    }

    public setActivo(activo: boolean): void {
        this.activo = activo;
    }

}
