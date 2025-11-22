import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn()
  persona_id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  documento?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  domicilio?: string;

  @Column({ type: 'date', nullable: true })
  fecha_nac?: string;

  @Column({ type: 'int' })
  tipoPersona_id: number; // 1 = Admin, 2 = Profesor, 3 = Cliente

  @Column({ type: 'boolean', default: true })
  activo: boolean;


}
