import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateProfesorDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido: string;

  @IsNotEmpty()
  @IsString()
  documento: string;

  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true; // 👈 nuevo campo, por defecto queda activo
}
