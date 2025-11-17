import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hora } from './entities/hora.entity';

@Injectable()
export class HorasService{
  findAllActivas: any;

  //private horas : Hora[] = [];
  
  constructor(@InjectRepository(Hora)
    private readonly horaRepository: Repository<Hora>,
  ) {}

  // Obtengo todos las horas
  public async findAll(): Promise<Hora[]> {
    return await this.horaRepository.find();
  }

  // Obtengo una hora por ID
  public async findOne(id: number): Promise<Hora> {
    const hora = await this.horaRepository.findOne({ where: { hora_id: id } });
    if (!hora) {
      throw new NotFoundException(`Hora con id ${id} no encontrada`);
    }
    return hora;
  }
  

}

/*
import { Injectable } from '@nestjs/common';
import { CreateHoraDto } from './dto/create-hora.dto';
import { UpdateHoraDto } from './dto/update-hora.dto';

@Injectable()
export class HorasService {
  create(createHoraDto: CreateHoraDto) {
    return 'This action adds a new hora';
  }

  findAll() {
    return `This action returns all horas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hora`;
  }

  update(id: number, updateHoraDto: UpdateHoraDto) {
    return `This action updates a #${id} hora`;
  }

  remove(id: number) {
    return `This action removes a #${id} hora`;
  }
}
*/
