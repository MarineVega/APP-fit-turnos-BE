import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum TipoPersonaEnum {
  ADMIN = 1,
  PROFESOR = 2,
  CLIENTE = 3,
}

export class UpdatePersonaDto {
  @IsOptional()
  @IsNumber()
  persona_id?: number;

  // Todos estos son opcionales y NO se validan
  @IsOptional()
  nombre?: string;

  @IsOptional()
  apellido?: string;

  @IsOptional()
  documento?: string;

  @IsOptional()
  telefono?: string;

  @IsOptional()
  domicilio?: string;

  @IsOptional()
  fecha_nac?: string;

  @IsOptional()
  @IsEnum(TipoPersonaEnum, { message: 'seleccione el tipo de persona' })
  tipoPersona_id?: TipoPersonaEnum;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
