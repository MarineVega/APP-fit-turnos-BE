import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO interno para Persona (debe ir ARRIBA)
export class PersonaDto {
  @IsOptional()
  @IsNumber()
  persona_id?: number;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  documento?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  domicilio?: string;

  @IsOptional()
  @IsString()
  fecha_nac?: string;

  // ÚNICO campo obligatorio
  @IsNumber()
  tipoPersona_id: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

// DTO principal de Usuario
export class CreateUsuarioDto {
  @IsOptional()
  @IsNumber()
  usuario_id?: number;

  @IsString()
  usuario: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;

  @IsObject()
  @ValidateNested()
  @Type(() => PersonaDto)
  persona: PersonaDto;
}
