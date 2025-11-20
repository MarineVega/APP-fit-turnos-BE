import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Min, Max, IsString, IsDate, isNotEmpty, MaxLength, Matches } from 'class-validator';
import { IsValidDate } from 'src/validators/is-valid-date.decorator';
//npm install class-validator class-transformer

export class CreateReservaDto {
    @IsInt()
    @IsNotEmpty({ message: 'El campo actividad_id es obligatorio.' })
    actividad_id: number;

    @IsInt()
    @IsOptional()
    profesor_id?: number;

    @IsInt()
    @IsNotEmpty({ message: 'El campo cliente_id es obligatorio.' })
    cliente_id: number;

    @IsInt()
    @IsNotEmpty({ message: 'El campo horario_id es obligatorio.' })
    horario_id: number;
/*
    @IsString()
    @IsNotEmpty({ message: 'El campo fecha es obligatorio.' })
    fecha: string;
*/
    @IsString({ message: 'La fecha debe ser un texto.' })
    @IsNotEmpty({ message: 'El campo fecha es obligatorio.' })
    //@MaxLength(10, { message: 'El campo fecha no puede tener más de 10 caracteres.' })
    //@Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha debe tener el formato YYYY-MM-DD.' })
    @IsValidDate({ message: 'La fecha debe ser real y válida (YYYY-MM-DD).' })
    fecha: string;

    @IsBoolean()
    @IsNotEmpty({ message: 'El campo activo es obligatorio.' })
    activo: boolean;
}
