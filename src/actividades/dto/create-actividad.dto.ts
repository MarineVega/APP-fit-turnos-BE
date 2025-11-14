import { IsString, IsNotEmpty, Length, IsInt, Min, Max, IsOptional, IsBoolean } from "class-validator";

export class CreateActividadDto {
  
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres.' })
    readonly nombre: string;

    @IsString()
    @IsNotEmpty({ message: 'La descripción es obligatoria.' })
    @Length(5, 100, { message: 'La descripción debe tener entre 5 y 100 caracteres.' })
    readonly descripcion: string;

    @IsInt({ message: 'El cupo máximo debe ser un número entero.' })
    @Min(1, { message: 'El cupo máximo debe ser al menos 1.' })
    @Max(100, { message: 'El cupo máximo no puede ser mayor que 100.' })
    readonly cupoMaximo: number;

    @IsString()
    @IsOptional()
    @Length(1, 100, { message: 'El nombre de la imagen no puede superar los 100 caracteres.' })
    readonly imagen: string;

    @IsBoolean()
    readonly activa: boolean;
}
