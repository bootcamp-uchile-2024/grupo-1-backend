import { Injectable } from '@nestjs/common';
import { CreateDetalleOrdenCompraDto } from '../dto/create-detalle-orden-compra.dto';
import { DetalleOrdenCompra } from '../entities/detalle_orden_compra.entity';
@Injectable()
export class DetalleOrdenComprasService {
  detalleOrdenes: DetalleOrdenCompra[] = [];
  create(createDetalleOrdenCompraDto: CreateDetalleOrdenCompraDto) {
    return ' En construcción detalle de orden de compra';
  }
}
