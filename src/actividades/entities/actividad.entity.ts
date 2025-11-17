//import { stringify } from "querystring";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('actividades')
export class Actividad {    
  
    @PrimaryGeneratedColumn({ name: 'actividad_id' })
        actividad_id: number;

    @Column({ name: 'nombre', length: 50 })
        nombre: string;

    @Column({ name: 'descripcion', length: 100 })
        private descripcion: string;
    
    @Column({ name: 'cupoMaximo', type: 'int' })
        private cupoMaximo: number;
        
    @Column({ name: 'imagen', length: 100 })
        private imagen: string;

    @Column({ name: 'activa', type: 'boolean', default: true })
        private activa: boolean;

    constructor (
        nombre: string, 
        descripcion: string, 
        cupoMaximo: number, 
        imagen: string, 
        activa: boolean
    ) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.cupoMaximo = cupoMaximo;
        this.imagen = imagen;
        this.activa = activa;
    }

    
    public getActividad_id(): number { 
        return this.actividad_id; 
    }

    public setActividad_id (actividad_id: number): void { 
        this.actividad_id = actividad_id; 
    }

    public getNombre(): string { 
        return this.nombre; 
    }

    public setNombre(nombre: string): void { 
        this.nombre = nombre; 
    }

    public getDescripcion(): string { 
        return this.descripcion; 
    }

    public setDescripcion(descripcion: string): void { 
        this.descripcion = descripcion; 
    }

    public getCupoMaximo(): number { 
        return this.cupoMaximo; 
    }

    public setCupoMaximo(value: number) {
        if ((value < 1) || (value > 100 )) throw new Error('El cupo máximo debe estar entre 1 y 100.');
        this.cupoMaximo = value;
    }

     public getImagen(): string { 
        return this.imagen; 
    }

    public setImagen(imagen: string): void { 
        this.imagen = imagen; 
    }
       
    public getActiva(): boolean {
        return this.activa;
    }

    public setActiva(activa: boolean): void {
        this.activa = activa;
    }

}

