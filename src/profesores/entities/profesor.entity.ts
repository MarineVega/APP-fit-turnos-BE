import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Persona } from '../../usuarios/entities/persona.entity';
import { IsOptional, IsString, Length } from 'class-validator';
import { Horario } from '../../horarios/entities/horario.entity';

@Entity('profesores')
export class Profesor {
  @PrimaryGeneratedColumn()
  profesor_id: number;

  @OneToOne(() => Persona, { eager: true })
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  @Length(2, 100, { message: 'El título debe tener entre 2 y 100 caracteres' })
  titulo?: string;

  // 👇 Relación correcta
  @OneToMany(() => Horario, horario => horario.profesor)
  horarios: Horario[];
}
