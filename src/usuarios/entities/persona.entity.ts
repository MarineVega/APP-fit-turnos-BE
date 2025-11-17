import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
  Max,
} from 'class-validator';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn()
  persona_id: number; // Autogenerado, sin validación

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @Length(2, 100, { message: 'El apellido debe tener entre 2 y 100 caracteres' })
  apellido: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  @IsString()
  @Length(6, 20, { message: 'El documento debe tener entre 6 y 20 caracteres' })
  documento?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  @IsString()
  @Length(6, 20, { message: 'El teléfono debe tener entre 6 y 20 caracteres' })
  telefono?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  @IsOptional()
  @IsString()
  @Length(5, 150, { message: 'El domicilio debe tener entre 5 y 150 caracteres' })
  domicilio?: string;

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)' })
  fecha_nac?: string;

  @Column({ type: 'int' })
  @IsInt({ message: 'El tipoPersona_id debe ser un número entero' })
  @Min(1, { message: 'El tipoPersona_id debe ser al menos 1' })
  @Max(3, { message: 'El tipoPersona_id no puede ser mayor a 3' })
  tipoPersona_id: number; // 1 = Admin, 2 = Profesor, 3 = Cliente

  @Column({ type: 'boolean', default: true })
  @IsBoolean({ message: 'Activo debe ser un valor booleano' })
  activo: boolean;
}
