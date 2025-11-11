import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateActividadDto {
  @IsOptional()                     // permite enviar solo lo que se quiere actualizar.
  @IsString()
  readonly nombre?: string;

  @IsOptional()
  @IsString()
  readonly descripcion?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  readonly cupoMaximo?: number;

  @IsOptional()
  @IsString()
  readonly imagen?: string;

  @IsOptional()
  @IsBoolean()
  readonly activa?: boolean;
}

