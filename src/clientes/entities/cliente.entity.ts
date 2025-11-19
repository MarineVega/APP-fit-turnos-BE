import { Persona } from "src/usuarios/entities/persona.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('clientes')
export class Cliente {

    @PrimaryGeneratedColumn({ name: 'cliente_id' })
        cliente_id: number;
   
    @OneToOne(() => Persona, { eager: true })
    @JoinColumn({ name: 'persona_id' })
    persona: Persona; // Relación con persona

   
    public getCliente_id(): number {
        return this.cliente_id;
    }

    public setCliente_id(cliente_id: number): void {
        this.cliente_id = cliente_id;
    }
}
