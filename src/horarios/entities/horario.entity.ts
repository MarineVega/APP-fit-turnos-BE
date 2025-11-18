import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Actividad } from "src/actividades/entities/actividad.entity";
import { Profesor } from "src/profesores/entities/profesor.entity";
import { Hora } from "src/horas/entities/hora.entity";

@Entity('horarios')
export class Horario {
    
    @PrimaryGeneratedColumn({ name: 'horario_id' })
        horario_id: number;

    @ManyToOne(() => Actividad, { eager: true })    // Creo la relación con la entidad Actividad (una actividad puede tener muchos horarios). --> { eager: true } → Hace que TypeORM cargue automáticamente la relación al hacer un find() (sin necesidad de usar relations manualmente).
    @JoinColumn({ name: 'actividad_id' })           // Especifico el nombre de la columna FK en la tabla horarios
        private actividad: Actividad;

    /*
    @ManyToOne(() => Profesor, { eager: true })
    @JoinColumn({ name: 'profesor_id' })
        private profesor: Profesor;
    */
    //mocke o “harcodeo” los datos de Profesor para que el sistema no intente hacer el JOIN automáticamente
    @ManyToOne(() => Profesor, { eager: false, nullable: true })
    @JoinColumn({ name: 'profesor_id' })
        private profesor: Profesor | null;

    @Column({ name: 'dias_id', length: 100, nullable: false })
        private dias: string;

    @ManyToOne(() => Hora, { eager: true })
    @JoinColumn({ name: 'hora_id' })
        private hora: Hora;

    @Column({ name: 'cupoMaximo', type: 'int', nullable: true })
        private cupoMaximo: number | null;
        
    @Column({ name: 'activo', type: 'boolean' })
        private activo: boolean;

    constructor (
        actividad: Actividad,
        profesor: Profesor | null,
        dias: string ,
        hora: Hora,
        cupoMaximo: number | null, 
        activo: boolean
    ) {
        this.actividad = actividad;
        this.profesor = profesor;
        this.dias = dias;
        this.hora = hora;
        this.cupoMaximo = cupoMaximo;
        this.activo = activo;
    }

    public getHorario_id(): number {
        return this.horario_id;
    }

    public setHorario_id(horario_id: number): void {
        this.horario_id = horario_id;
    }

    // Los get y set devuelven o establecen directamente las entidades completas, no solo el ID.

    public getActividad(): Actividad {
        return this.actividad;
    }

    public setActividad(actividad: Actividad): void {
        this.actividad = actividad;
    }

    /*  Descomentar cuando esté programado Profesor
    public getProfesor(): Profesor {
        return this.profesor;
    }

    public setProfesor(profesor: Profesor): void {
        this.profesor = profesor;
    }
    */
   public getProfesor(): Profesor | null {
        return this.profesor;
    }

    public setProfesor(profesor: Profesor | null): void {
        this.profesor = profesor;
    }

    public getDias(): string {
        return this.dias;
    }

    public setDias(dias: string): void {
        // Normalizo el formato al guardar
        this.dias = dias
            .split(',')
            .map(d => d.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) // quita tildes
            .join(',');
    }

    public getHora(): Hora {
        return this.hora;
    }

    public setHora(hora: Hora): void {
        this.hora = hora;
    }

    public getCupoMaximo(): number | null {
        return this.cupoMaximo;
    }

    public setCupoMaximo(value: number | null): void {        
        if (value === null) {
            this.cupoMaximo = null;
        } else if (value < 1 || value > 100) {
            throw new Error('El cupo máximo debe estar entre 1 y 100.');
        } else {
            this.cupoMaximo = value;
        }
    }

    public getActivo(): boolean {
        return this.activo;
    }

    public setActivo(activo: boolean): void {
        this.activo = activo;
    }

}
