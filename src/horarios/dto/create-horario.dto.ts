import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Min, Max } from 'class-validator';
//npm install class-validator class-transformer

export class CreateHorarioDto {
  @IsInt()
  @IsNotEmpty({ message: 'El campo actividad_id es obligatorio.' })
  actividad_id: number;

  @IsInt()
  @IsOptional()
  profesor_id?: number;     // opcional

  @IsInt()
  @IsNotEmpty({ message: 'El campo hora_id es obligatorio.' })
  hora_id: number;

  @IsOptional()
  @IsInt({ message: 'El cupo máximo debe ser un número entero.' })
  @Min(1, { message: 'El cupo máximo debe ser al menos 1.' })
  @Max(100, { message: 'El cupo máximo no puede ser mayor que 100.' })
  cupoMaximo?: number | null;

  @IsBoolean()
  @IsNotEmpty({ message: 'El campo activo es obligatorio.' })
  activo: boolean;
}

