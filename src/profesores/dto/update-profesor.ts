import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsBoolean,
} from 'class-validator';

export class UpdateProfesorDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede superar los 50 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede superar los 50 caracteres' })
  apellido?: string;

  @IsOptional()
  @IsString({ message: 'El documento debe ser una cadena de texto' })
  @Matches(/^\d{7,10}$/, {
    message: 'El documento debe tener entre 7 y 10 dígitos numéricos',
  })
  documento?: string;

  @IsOptional()
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MinLength(2, { message: 'El título debe tener al menos 2 caracteres' })
  @MaxLength(100, {
    message: 'El título no puede superar los 100 caracteres',
  })
  titulo?: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser verdadero o falso' })
  activo?: boolean; // actualizar estado
}
