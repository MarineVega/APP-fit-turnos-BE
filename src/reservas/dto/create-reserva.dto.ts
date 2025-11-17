import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Min, Max, IsString, IsDate, isNotEmpty } from 'class-validator';
//npm install class-validator class-transformer

export class CreateReservaDto {
    @IsInt()
    @IsNotEmpty({ message: 'El campo actividad_id es obligatorio.' })
    actividad_id: number;

    @IsInt()
    @IsNotEmpty({ message: 'El campo profesor_id es obligatorio.' })
    profesor_id: number;

    @IsInt()
    @IsNotEmpty({ message: 'El campo cliente_id es obligatorio.' })
    cliente_id: number;

    @IsInt()
    @IsNotEmpty({ message: 'El campo horario_id es obligatorio.' })
    horario_id: number;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty({ message: 'El campo fecha es obligatorio.' })
    fecha: Date;

    @IsBoolean()
    @IsNotEmpty({ message: 'El campo activo es obligatorio.' })
    activo: boolean;
}
