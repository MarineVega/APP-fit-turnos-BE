import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreatePersonaDto {
  @IsOptional()
  @IsNumber()
  persona_id?: number;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido: string;

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

  @IsNotEmpty()
  @IsNumber()
  tipoPersona_id: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}

export class CreateUsuarioDto {
  @IsOptional()
  @IsNumber()
  usuario_id?: number;

  @IsNotEmpty()
  @IsString()
  usuario: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;

  @IsObject()
  @ValidateNested()
  @Type(() => CreatePersonaDto)
  persona: CreatePersonaDto;
}
