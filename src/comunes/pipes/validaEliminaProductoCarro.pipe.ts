import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ProductosService } from 'src/productos/service/productos.service';
import { CreateDetalleOrdenCompraDto } from 'src/ventas/dto/create-detalle-orden-compra.dto';
import { DetalleOrdenComprasService } from 'src/ventas/service/detalle-orden-compras.service';
import { OrdenComprasService } from 'src/ventas/service/orden-compras.service';

@Injectable()
export class ValidaEliminaProductoCarroPipe implements PipeTransform {
  constructor(
    private readonly ordencompraService: OrdenComprasService,
    private readonly detalleordenService: DetalleOrdenComprasService,
  ) {}

  async transform(
    value: CreateDetalleOrdenCompraDto,
    { metatype }: ArgumentMetadata,
  ) {
    const { idOrden, idProducto } = value;
    if (!idOrden || !idProducto) {
      throw new BadRequestException('Error al quitar producto, campos nulos');
    }
    const idOrdenNumber = Number(idOrden);
    if (isNaN(idOrdenNumber)) {
      throw new BadRequestException(
        'Error al quitar producto, campos no validos',
      );
    }
    const carrito = await this.ordencompraService.findOneOC(idOrdenNumber);
    if (!carrito) {
      throw new BadRequestException(
        'Error al quitar producto, campos no validos',
      );
    }
    const detalle = await this.detalleordenService.findOneProductOC(
      idOrdenNumber,
      idProducto,
    );
    if (!detalle) {
      throw new BadRequestException(
        'Error al quitar producto, no existe producto en carrito',
      );
    }
    return value;
  }
}
