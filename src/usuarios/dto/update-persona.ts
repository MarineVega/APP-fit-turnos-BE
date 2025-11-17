import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  Max,
} from 'class-validator';

export enum TipoPersonaEnum {
  ADMIN = 1,
  PROFESOR = 2,
  CLIENTE = 3,
}

export class UpdatePersonaDto {
  @IsOptional()
  @IsNumber()
  persona_id?: number;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  apellido?: string;

  @IsOptional()
  @IsString()
  @Length(6, 20)
  documento?: string;

  @IsOptional()
  @IsString()
  @Length(6, 20)
  telefono?: string;

  @IsOptional()
  @IsString()
  @Length(5, 150)
  domicilio?: string;

  @IsOptional()
  @IsDateString()
  fecha_nac?: string;

  @IsOptional()
  @IsEnum(TipoPersonaEnum, { message: 'seleccione el tipo de persona' })
  tipoPersona_id?: TipoPersonaEnum;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
