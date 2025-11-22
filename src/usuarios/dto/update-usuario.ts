import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdatePersonaDto } from './update-persona';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsNumber()
  usuario_id?: number;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  usuario?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  // 🔥 NUEVOS CAMPOS EXACTAMENTE COMO EN TU TABLA
  @IsOptional()
  @IsNumber()
  verificado?: number;

  @IsOptional()
  @IsString()
  verification_token?: string | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdatePersonaDto)
  persona?: UpdatePersonaDto;
}
