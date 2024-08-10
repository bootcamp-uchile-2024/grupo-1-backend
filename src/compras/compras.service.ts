import { Injectable } from '@nestjs/common';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';

@Injectable()
export class ComprasService {
  create(createCompraDto: CreateCompraDto) {
    return 'This action adds a new compra';
  }

  findAll() {
    return `Modulo de compras - Epica de compras - Retorna todas las compras`;
  }

  findOne(id: number) {
    return `Modulo de compras - Epica de compras / Retorna  #${id} compra`;
  }

  update(id: number, updateCompraDto: UpdateCompraDto) {
    return `Modulo de compras - Epica de compras / Actualiza campos de  #${id} compra`;
  }

  remove(id: number) {
    return `Modulo de compras - Epica de compras / Elimina #${id} compra`;
  }
}
