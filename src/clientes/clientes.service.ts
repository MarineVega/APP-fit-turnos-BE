import { Injectable,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Persona } from 'src/usuarios/entities/persona.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepo: Repository<Cliente>,

    @InjectRepository(Reserva)
    private reservasRepo: Repository<Reserva>,

    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,

    @InjectRepository(Persona)
    private personasRepo: Repository<Persona>,
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

  // NO borrar si tiene reservas
  // ✔ SI NO tiene → borrar cliente + usuario + persona
  async removeByPersonaId(persona_id: number) {
    // 1) buscar cliente
    const cliente = await this.findByPersonaId(persona_id);

    if (!cliente) {
      throw new BadRequestException('El cliente no existe');
    }

    // 2) verificar si tiene reservas
    const reservas = await this.reservasRepo.count({
      where: { cliente: { cliente_id: cliente.cliente_id } },
    });

    if (reservas > 0) {
      throw new BadRequestException(
        'No se puede eliminar el cliente porque tiene reservas activas',
      );
    }

    // 3) buscar usuario relacionado
    const usuario = await this.usuariosRepo.findOne({
      where: { persona: { persona_id } },
    });

    // 4) eliminar CLIENTE
    await this.clientesRepo.remove(cliente);

    // 5) si existe usuario asociado → eliminar usuario
    if (usuario) {
      await this.usuariosRepo.remove(usuario);
    }

    // 6) eliminar PERSONA SIEMPRE
    const persona = await this.personasRepo.findOne({
      where: { persona_id },
    });

    if (persona) {
      await this.personasRepo.remove(persona);
    }

    return { ok: true, message: 'Cliente, usuario y persona eliminados correctamente' };
  }


//chequear si un cliente tiene reservas
async clienteTieneReservas(cliente_id: number): Promise<boolean> {
  const count = await this.reservasRepo.count({
    where: { cliente: { cliente_id } },
  });

  return count > 0;
}

}

