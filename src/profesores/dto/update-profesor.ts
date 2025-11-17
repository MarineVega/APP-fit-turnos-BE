import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateProfesorDto {
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
  titulo?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean; // 👈 nuevo campo opcional para activar/desactivar
}
