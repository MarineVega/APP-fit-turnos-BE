import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuariosService {
  private usuarios : Usuario[] = [];

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}
/*
  public async getAll() : Promise<Usuario[]> {
    //Crea un areglo de objetos de la clase Usuario con la respuesta de la BD
    let usuarios: Usuario[] = await this.usuarioRepository.find( );
    return this.usuarios;
  }
*/
/*
  public async getAll(): Promise<Usuario[]> {
  return await this.usuarioRepository.find({
    relations: ['persona', 'rolPersona'], // si tu entidad tiene relaciones
    where: { activo: true }, // ejemplo: solo activos
  });
}

  
  public async getById(id: number): Promise<Usuario | null> {
  const usuario = await this.usuarioRepository.findOne({
    where: { id },  // usa el nombre real de la propiedad en la entidad
  });

  return usuario;
}
/*
  public async getById(id : number) : Promise<Usuario | null> {
    /*const criterio : FindOneOptions = { where: { usuario_id: id } }

    let usuario : Usuario = await this.usuarioRepositoryRepository.findOne( criterio );
    if (usuario)
*/
    /*
    const usuario = await this.usuarioRepository.findOne({
      where: { usuario_id: id },
    });

    const usuario = await this.usuarioRepository.findOne({
  where: { id },
});
    
    return usuario;
  }
*/

  create(createUsuarioDto: CreateUsuarioDto) {
    return 'This action adds a new usuario';
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
