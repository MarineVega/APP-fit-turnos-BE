import { Controller, Get, Param } from '@nestjs/common';
import { ClientesService } from './clientes.service';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  // ───────────────────────────────────────────────
  // NUEVO: verificar si un cliente (por persona_id) tiene reservas
  // ───────────────────────────────────────────────
  @Get('tiene-reservas/:persona_id')
  async tieneReservas(@Param('persona_id') persona_id: number) {
    const cliente = await this.clientesService.findByPersonaId(persona_id);

    // Si no existe cliente, no puede tener reservas → false
    if (!cliente) {
      return { tieneReservas: false };
    }

    const flag = await this.clientesService.clienteTieneReservas(
      cliente.cliente_id,
    );

    return { tieneReservas: flag };
  }
}
