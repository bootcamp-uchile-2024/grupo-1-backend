import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ProductosService } from 'src/productos/service/productos.service';
import { CreateDetalleOrdenCompraDto } from 'src/ventas/dto/create-detalle-orden-compra.dto';
import { OrdenComprasService } from 'src/ventas/service/orden-compras.service';

@Injectable()
export class ValidaProductoCarritoPipe implements PipeTransform {
  constructor(
    private readonly productosServices: ProductosService,
    private readonly ordencompraService: OrdenComprasService,
  ) {}
  async transform(
    value: CreateDetalleOrdenCompraDto,
    { metatype }: ArgumentMetadata,
  ) {
    const { idOrden, idProducto, cantidad } = value;
    if (!idOrden || !idProducto || !cantidad) {
      throw new BadRequestException('Error al procesar datos del carrito');
    }
    const idOrdenNumber = Number(idOrden);
    if (isNaN(idOrdenNumber)) {
      throw new BadRequestException('Error al procesar carrito');
    }
    const carrito = await this.ordencompraService.findOneOC(idOrdenNumber);
    if (!carrito) {
      throw new BadRequestException('Error al procesar orden compra');
    }
    const producto = await this.productosServices.findOneOC(idProducto);
    if (!producto) {
      throw new BadRequestException(
        'Error al procesar producto en carrito compras',
      );
    }
    if (cantidad > Number(producto.stock)) {
      throw new BadRequestException(
        'La cantidad solicitada supera el stock disponible',
      );
    }
    return value;
  }
}
