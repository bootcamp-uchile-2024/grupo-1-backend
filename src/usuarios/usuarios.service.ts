import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  create(createUsuarioDto: CreateUsuarioDto) {
    return 'Modulo Usuario - Epica Usuarios / Crea un usuario';
  }

  findAll() {
    return `Modulo Usuario - Epica Usuarios / Retorna todos los usuarios`;
  }

  findOne(id: number) {
    return `Modulo Usuario - Epica Usuario / retorna por id  #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `Modulo Usuario - Epica Usuario / Actualiza Usuario #${id} usuario`;
  }

  remove(id: number) {
    return `TModulo Usuario - Epica Usuario / Elimina #${id} usuario`;
  }
}
