import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepo: Repository<Cliente>,
  ) {}

  // Listar todos los clientes
  findAll() {
    return this.clientesRepo.find({
      relations: ['persona'],
    });
  }

  // Buscar un cliente por persona_id
  findByPersonaId(persona_id: number) {
    return this.clientesRepo.findOne({
      where: { persona: { persona_id } },
      relations: ['persona'],
    });
  }

  // Crear cliente para persona_id (SE USA PARA ALTA/EDICIÓN USUARIO)
  async createFromPersona(persona_id: number) {
    const existing = await this.findByPersonaId(persona_id);

    if (existing) return existing; // ya existe, no duplicamos

    const nuevo = this.clientesRepo.create({
      persona: { persona_id },
    });

    return await this.clientesRepo.save(nuevo);
  }

  // Eliminar cliente por persona_id
  async removeByPersonaId(persona_id: number) {
    const cliente = await this.findByPersonaId(persona_id);

    if (cliente) {
      await this.clientesRepo.remove(cliente);
    }
  }
}
