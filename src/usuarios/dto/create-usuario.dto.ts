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

// DTO de Persona
export class PersonaDto {
  @IsOptional()
  @IsNumber({}, { message: 'El ID de persona debe ser un número.' })
  persona_id?: number;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto.' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser un texto.' })
  apellido?: string;

  @IsOptional()
  @IsString({ message: 'El debe ser un numero válido.' })
  documento?: string;

  @IsOptional()
  @IsString({ message: 'coloque un numero de telefono valido.' })
  telefono?: string;

  @IsOptional()
  @IsString({ message: 'El domicilio debe ser un texto.' })
  domicilio?: string;

  @IsOptional()
  @IsString({ message: 'La fecha de nacimiento debe tener formato ##/##/####.' })
  fecha_nac?: string;

  // Obligatorio: tipo de persona
  @IsNumber({}, { message: 'El tipo de persona es obligatorio y debe ser un número.' })
  tipoPersona_id: number;
 
  // Opcional: activo
  @IsBoolean({ message: 'Activo debe ser un valor booleano.' })
  activo?: boolean;


}

// DTO de Usuario
export class CreateUsuarioDto {
  @IsOptional()
  @IsNumber({}, { message: 'El ID de usuario debe ser un número.' })
  usuario_id?: number;

  @IsString({ message: 'El nombre de usuario es obligatorio.' })
  usuario: string;

  @IsEmail({}, { message: 'El email debe tener un formato válido.' })
  email: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @IsString({ message: 'La contraseña debe ser un texto.' })
  password: string;

 
  @IsOptional()
  @IsNumber({}, { message: 'El campo verificado debe ser un número (0 o 1).' })
  verificado?: number;

  @IsOptional()
  @IsString({ message: 'El token de verificación debe ser un texto.' })
  verification_token?: string | null;

  // Validación de objeto persona
  @IsObject({ message: 'El campo persona debe ser un objeto válido.' })
  @ValidateNested()
  @Type(() => PersonaDto)
  persona: PersonaDto;
}
