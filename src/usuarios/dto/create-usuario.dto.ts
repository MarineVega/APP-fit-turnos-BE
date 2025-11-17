import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoPersonaEnum {
  ADMIN = 1,
  PROFESOR = 2,
  CLIENTE = 3,
}

class CreatePersonaDto {
  @IsOptional()
  @IsNumber()
  persona_id?: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  apellido: string;

  @IsOptional()
  @IsString()
  @Length(6, 20)
  documento?: string;

  @IsOptional()
  @IsString()
  @Length(6, 20)
  telefono?: string;

  @IsOptional()
  @IsString()
  @Length(5, 150)
  domicilio?: string;

  @IsOptional()
  @IsDateString()
  fecha_nac?: string;

  @IsNotEmpty()
  @IsEnum(TipoPersonaEnum, { message: 'tipoPersona_id debe ser 1, 2 o 3' })
  tipoPersona_id: TipoPersonaEnum;

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
  @Length(3, 50, { message: 'El usuario debe tener entre 3 y 50 caracteres' })
  usuario: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
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
