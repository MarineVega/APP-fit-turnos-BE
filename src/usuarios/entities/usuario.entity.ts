import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Persona } from './persona.entity'; // ✅ ajustá la ruta si tu entidad está en otra carpeta

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  usuario_id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  usuario: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // ✅ Relación con Persona
  @OneToOne(() => Persona, { cascade: true, eager: true })
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;
}




