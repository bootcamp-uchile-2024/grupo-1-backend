import { Injectable } from '@nestjs/common';
import { CreateDetalleOrdenCompraDto } from './dto/create-detalle-orden-compra.dto';
import { UpdateDetalleOrdenCompraDto } from './dto/update-detalle-orden-compra.dto';

@Injectable()
export class DetalleOrdenComprasService {
  create(createDetalleOrdenCompraDto: CreateDetalleOrdenCompraDto) {
    return 'This action adds a new detalleOrdenCompra';
  }

  findAll() {
    return `This action returns all detalleOrdenCompras`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detalleOrdenCompra`;
  }

  update(id: number, updateDetalleOrdenCompraDto: UpdateDetalleOrdenCompraDto) {
    return `This action updates a #${id} detalleOrdenCompra`;
  }

  remove(id: number) {
    return `This action removes a #${id} detalleOrdenCompra`;
  }
}
