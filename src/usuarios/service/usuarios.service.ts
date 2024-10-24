import { Injectable } from '@nestjs/common';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
@Injectable()
export class UsuariosService {
  // constructor(private readonly servicioPlantas: PlantasService) {}

  create(createUsuarioDto: CreateUsuarioDto) {
    return null;
  }
  findAll() {
    return null;
  }
  findOne(id: number): Usuario {
      return null;
  }

  remove(id: number) {
    return `TModulo Usuario - Epica Usuario / Elimina #${id} usuario`;
  }
}
