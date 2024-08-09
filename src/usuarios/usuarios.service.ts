import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  create(createUsuarioDto: CreateUsuarioDto) {
    return 'Modulo Usuarios - Corresponde a la epica de Usuarios /Ingresar Usuarios';
  }

  findAll() {
    return `Modulo Usuarios - Corresponde a la epica de Usuarios / retorna todos los usuarios`;
  }

  findOne(id: number) {
    return `Modulo Usuarios - Corresponde a la epica de Usuarios  #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `Modulo Usuarios - Corresponde a la epica de Usuarios / Actualiza Usuario a #${id} usuario`;
  }

  remove(id: number) {
    return `Modulo Usuarios - Corresponde a la epica de Usuarios /Elimina Usuario #${id} usuario`;
  }
}
