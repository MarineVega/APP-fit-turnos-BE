import { PartialType } from '@nestjs/mapped-types';
import { CreateReservaDto } from './create-reserva.dto';
import { IsOptional, IsInt, IsDate, IsBoolean } from 'class-validator';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {
    @IsOptional()
    @IsInt()    
    actividad_id?: number;

    @IsOptional()
    @IsInt()
    profesor_id?: number;
    
    @IsOptional()
    @IsInt()
    cliente_id?: number;

    @IsOptional()
    @IsInt()
    horario_id?: number;

    @IsOptional()
    @IsDate()
    fecha?: string;

    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}
