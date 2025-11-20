import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('horas')
export class Hora {

    @PrimaryGeneratedColumn({ name: 'hora_id' })
        hora_id: number;

    @Column({ name: 'horaInicio', type: 'time' })
        horaInicio: string;

    @Column({ name: 'horaFin', type: 'time' })
        private horaFin: string;

    @Column({ name: 'activa', type: 'boolean', default: true })
       activa: boolean;


    constructor(
        horaInicio: string, 
        horaFin: string,
        activa: boolean
    ) {
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.activa = activa;
    }

    public getHora_id(): number {
        return this.hora_id;
    }

    public setHora_id(hora_id: number): void {
        this.hora_id = hora_id;
    }

    public getHoraInicio(): string {
        return this.horaInicio;
    }

    public setHoraInicio(horaInicio: string): void {
        this.horaInicio = horaInicio;
    }

    public getHoraFin(): string {
        return this.horaFin;
    }

    public setHoraFin(horaFin: string): void {
        this.horaFin = horaFin;
    }

    public getActiva(): boolean {
        return this.activa;
    }

    public setActiva(activa: boolean): void {
        this.activa = activa;
    }
}
