import { PartialType } from '@nestjs/mapped-types';
import { CreateHoraDto } from './create-hora.dto';

export class UpdateHoraDto extends PartialType(CreateHoraDto) {}
