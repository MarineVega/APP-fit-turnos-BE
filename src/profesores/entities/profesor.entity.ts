import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('profesores')
export class Profesor {

    @PrimaryGeneratedColumn({ name: 'profesor_id' })
        profesor_id: number;
    /*    
    @Column({ name: 'apellido', length: 50 })
        private apellido: string;
    
    @Column({ name: 'nombre', length: 50 })
        private nombre: string;

    @Column({ name: 'activo', type: 'boolean', default: true })
        private activo: boolean;
*/
    constructor(
        /*apellido: string, 
        nombre: string, 
        activo: boolean = true
        */
    ) {
     /*   this.apellido = apellido;
        this.nombre = nombre;
        this.activo = activo;
        */
    }

    public getProfesor_id(): number {
        return this.profesor_id;
    }

    public setProfesor_id(profesor_id: number): void {
        this.profesor_id = profesor_id;
    }
/*
    public getApellido(): string {
        return this.apellido;
    }

    public setApellido(apellido: string): void {
        this.apellido = apellido;
    }

    public getNombre(): string {
        return this.nombre;
    }

    public setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    public getActivo(): boolean {
        return this.activo;
    }

    public setActivo(activo: boolean): void {
        this.activo = activo;
    }
    */
}
