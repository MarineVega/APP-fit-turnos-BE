import { PartialType } from '@nestjs/mapped-types';
import { CreateHorarioDto } from './create-horario.dto';
import { IsOptional, IsInt, IsBoolean, Min, Max } from 'class-validator';

export class UpdateHorarioDto extends PartialType(CreateHorarioDto) {
  @IsOptional()
  @IsInt()
  actividad_id?: number;

  @IsOptional()
  @IsInt()
  profesor_id?: number;

  @IsOptional()
  @IsInt()
  hora_id?: number;

  @IsOptional()
  @IsInt({ message: 'El cupo máximo debe ser un número entero.' })
  @Min(1, { message: 'El cupo máximo debe ser al menos 1.' })
  @Max(100, { message: 'El cupo máximo no puede ser mayor que 100.' })
  cupoMaximo?: number | null;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
