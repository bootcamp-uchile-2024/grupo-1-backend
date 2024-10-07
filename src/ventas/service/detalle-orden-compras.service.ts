import { Injectable } from '@nestjs/common';
import { CreateDetalleOrdenCompraDto } from '../dto/create-detalle-orden-compra.dto';
import { DetalleOrdenCompra } from '../entities/detalle-orden-compra.entity';
@Injectable()
export class DetalleOrdenComprasService {
  detalleOrdenes: DetalleOrdenCompra[] = [];
  create(createDetalleOrdenCompraDto: CreateDetalleOrdenCompraDto) {
    const totalPrecio =
      createDetalleOrdenCompraDto.precio * createDetalleOrdenCompraDto.cantidad;
    const detalleOrden: DetalleOrdenCompra = new DetalleOrdenCompra(
      createDetalleOrdenCompraDto.idProducto,
      createDetalleOrdenCompraDto.cantidad,
      createDetalleOrdenCompraDto.precio,
      totalPrecio,
      createDetalleOrdenCompraDto.descuento,
    );
    this.detalleOrdenes.push(detalleOrden);
  }
}
