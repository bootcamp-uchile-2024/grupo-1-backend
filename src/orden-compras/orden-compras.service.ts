import { Injectable } from '@nestjs/common';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden-compra.dto';
import { VerDespachos } from 'src/despachos/dto/ver-despachos-dto';
import { EstadosDespacho } from 'src/despachos/entities/enum-despachos';

@Injectable()
export class OrdenComprasService {
  
  create(createOrdenCompraDto: CreateOrdenCompraDto) {
    return 'This action adds a new ordenCompra';
  }

  findAll() {
    return `This action returns all ordenCompras`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordenCompra`;
  }

  update(id: number, updateOrdenCompraDto: UpdateOrdenCompraDto) {
    return `This action updates a #${id} ordenCompra`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordenCompra`;
  }
}
