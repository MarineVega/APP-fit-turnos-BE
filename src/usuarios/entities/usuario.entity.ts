import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
//import { TipoUsuario } from './tipo-usuario.entity';

@Entity('usuarios')
export class Usuario {

    /*
    @PrimaryColumn()
        private usuario_id: number; 
    */

    @PrimaryGeneratedColumn({ name: 'usuario_id' })
        usuario_id: number;
   
/*
    @ManyToOne(() => TipoUsuario, tipoUsuario => tipoUsuario.usuarios, { eager: true })
    @JoinColumn({ name: 'tipoUsuario_id' })
    
    private tipoUsuario: TipoUsuario;
*/

    @Column()
        private tipoUsuario_id: number;

    @Column({ name: 'usuario', length: 50 })
        private usuario: string;

    @Column({ name: 'activo', type: 'boolean' })
        private activo: boolean;


    constructor (usuario_id: number, tipoUsuario_id: number, usuario: string, activo: boolean) {
        this.usuario_id = usuario_id;
        this.tipoUsuario_id = tipoUsuario_id;
        this.usuario = usuario;
        this.activo = activo;
    }

    
    public getUsuario_id(): number { 
        return this.usuario_id; 
    }

    public setUsuario_id (usuario_id: number): void { 
        this.usuario_id = usuario_id; 
    }

    public getTipoUsuario_id(): number { 
        return this.usuario_id; 
    }

    public setTipoUsuario_id (tipoUsuario_id: number): void { 
        this.tipoUsuario_id = tipoUsuario_id; 
    }

    public getUsuario(): string { 
        return this.usuario; 
    }
    public setUsuario(usuario: string): void { 
        this.usuario = usuario; 
    }

    public getActivo(): boolean {
        return this.activo;
    }

    public setActivo(activo: boolean): void {
        this.activo = this.activo;
    }

}

