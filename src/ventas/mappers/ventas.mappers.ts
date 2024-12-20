import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { CreateOrdenCompraDto } from '../dto/create-orden-compra.dto';
import { DetalleOrdenCompra } from '../entities/detalle_orden_compra.entity';
import { OrdenCompra } from '../entities/orden_compra.entity';
import { EstadoOrden } from '../enum/estadosOC';
import { GetOrdenDto } from '../dto/getOrden.dto';
import { CreateDetalleOrdenCompraDto } from '../dto/create-detalle-orden-compra.dto';
import { ProductosService } from 'src/productos/service/productos.service';
import { VerDetalleOrdenCompraDto } from '../dto/verDetalleOrden.dto';
import { GetOrdenCompraConDetalleDto } from '../dto/verOrdenCompra.dto';
import { Venta } from '../entities/venta.entity';
import { GetVentaDto } from '../dto/getVenta-dto';
export class VentaMappers {
  constructor(private readonly productoService: ProductosService) {}
  static async dtotoEntityOrden(
    dto: CreateOrdenCompraDto,
  ): Promise<OrdenCompra> {
    const orden = new OrdenCompra();
    const fechaactual = new Date(new Date().toISOString().split('T')[0]);
    orden.fechaOrden = fechaactual;
    const estado_OC: EstadoOrden = EstadoOrden.CREADA;
    orden.estado = estado_OC;
    orden.emailComprador = dto.emailComprador;
    orden.idUsuario = dto.idUsuario;
    return orden;
  }
  static async dtotoEntityDetalle(
    dto: CreateDetalleOrdenCompraDto,
    productoService: ProductosService,
  ): Promise<DetalleOrdenCompra> {
    console.log('servicio ', productoService);
    const detalleOc = new DetalleOrdenCompra();
    detalleOc.idOrdenCompra = dto.idOrden;
    detalleOc.idProducto = dto.idProducto;
    detalleOc.cantidad = dto.cantidad;
    console.log('detalleOc : ', detalleOc);
    const producto = await productoService.findOneOC(dto.idProducto);
    detalleOc.precio = producto.precioNormal;
    detalleOc.descuento = producto.descuento * dto.cantidad;
    detalleOc.totalProducto =
      dto.cantidad * producto.precioNormal - detalleOc.descuento;
    detalleOc.cantidadVenta = 0;
    console.log(detalleOc);
    return detalleOc;
  }

  static entityToDtoOrden(entity: OrdenCompra): GetOrdenDto {
    const dto = new GetOrdenDto();
    dto.id = entity.id;
    dto.emailComprador = entity.emailComprador;
    dto.fechaOrden = entity.fechaOrden;
    dto.estado = entity.estado;
    dto.idUsuario = entity.idUsuario;
    return dto;
  }
  static entityToDtoOrdenDetalle(
    entity: DetalleOrdenCompra,
  ): VerDetalleOrdenCompraDto {
    const dto = new VerDetalleOrdenCompraDto();
    dto.idOrden = entity.idOrdenCompra;
    dto.idProducto = entity.idProducto;
    dto.precio = entity.precio;
    dto.cantidad = entity.cantidad;
    dto.descuento = entity.descuento;
    dto.totalProducto = entity.totalProducto;

    return dto;
  }
  static buscarOrden(orden: OrdenCompra): GetOrdenCompraConDetalleDto {
    return {
      id: orden.id,
      fechaOrden: orden.fechaOrden,
      emailComprador: orden.emailComprador,
      estado: orden.estado,
      idUsuario: orden.idUsuario,
      detalles: orden.detallesOrden.map((detalle) => ({
        idOrden: detalle.idOrdenCompra,
        idProducto: detalle.idProducto,
        cantidad: detalle.cantidad,
        precio: detalle.precio,
        descuento: detalle.descuento,
        totalProducto: detalle.totalProducto,
      })) as VerDetalleOrdenCompraDto[],
    };
  }

  static buscarVenta(venta: Venta): GetVentaDto {
    return {
      id: venta.id,
      totalBruto: venta.totalBruto,
      iva: venta.iva,
      totalPago: venta.totalPago,
      nroComprobantePago: venta.nroComprobantePago,
    } as GetVentaDto;
  }
}
