import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Persona } from './entities/persona.entity';


// IMPORTANTE: importamos ClientesModule
import { ClientesModule } from 'src/clientes/clientes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Persona]),
    
    //  Para poder usar ClientesService dentro de UsuariosService
    ClientesModule,
    
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
  
})
export class UsuariosModule {}
