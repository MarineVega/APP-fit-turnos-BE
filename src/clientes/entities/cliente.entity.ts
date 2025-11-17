import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('clientes')
export class Cliente {

    @PrimaryGeneratedColumn({ name: 'cliente_id' })
        cliente_id: number;
   
    constructor(
    ) {
    }

    public getCliente_id(): number {
        return this.cliente_id;
    }

    public setCliente_id(cliente_id: number): void {
        this.cliente_id = cliente_id;
    }
}
