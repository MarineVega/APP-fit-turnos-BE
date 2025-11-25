import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Persona } from 'src/usuarios/entities/persona.entity';

import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente, Reserva, Usuario, Persona]),
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService],
})
export class ClientesModule {}
