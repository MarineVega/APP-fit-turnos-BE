import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Persona } from '../../usuarios/entities/persona.entity'; // Ajustá la ruta según tu proyecto
import { IsOptional, IsString, Length } from 'class-validator';

@Entity('profesores')
export class Profesor {
  @PrimaryGeneratedColumn()
  profesor_id: number;

  @OneToOne(() => Persona, { eager: true })
  @JoinColumn({ name: 'persona_id' })
  persona: Persona; // Relación con persona

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  @Length(2, 100, { message: 'El título debe tener entre 2 y 100 caracteres' })
  titulo?: string;
}
