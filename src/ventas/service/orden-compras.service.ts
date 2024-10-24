import { Injectable } from '@nestjs/common';
import { CreateOrdenCompraDto } from '../dto/create-orden-compra.dto';
import { OrdenCompra } from '../entities/orden_compra.entity';
import { EstadosOC } from '../enum/estadosOC';
import { ErrorPlantopia } from 'src/comunes/error-plantopia/error-plantopia';
import { DetalleOrdenCompra } from '../entities/detalle_orden_compra.entity';
import { ProductosService } from 'src/productos/service/productos.service';
import { DetalleOrdenComprasService } from './detalle-orden-compras.service';
import { CreateDetalleOrdenCompraDto } from '../dto/create-detalle-orden-compra.dto';
@Injectable()
export class OrdenComprasService {
  ordenesCompras: OrdenCompra[] = [];
  fechaHoy = new Date();
  fechaActual =
    String(this.fechaHoy.getFullYear()) +
    '-' +
    String(this.fechaHoy.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(this.fechaHoy.getDate()).padStart(2, '0');
  constructor(
    private readonly productoServices: ProductosService,
    private readonly detalleOrdenServices: DetalleOrdenComprasService,
  ) {}

  create(createOrdenCompraDto: CreateOrdenCompraDto) {
    return 'En construcción crear orden de compra';
  }
  findAll() {
    return 'en construcción listar ordenes de compra';
  }
}
