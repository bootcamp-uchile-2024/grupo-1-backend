import { Injectable } from '@nestjs/common';
import { CreateDetalleOrdenCompraDto } from '../dto/create-detalle-orden-compra.dto';
import { DetalleOrdenCompra } from '../entities/detalle_orden_compra.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VentaMappers } from '../mappers/ventas.mappers';
import { ProductosService } from 'src/productos/service/productos.service';
import { VerDetalleOrdenCompraDto } from '../dto/verDetalleOrden.dto';
@Injectable()
export class DetalleOrdenComprasService {
  constructor(
    private readonly productoServices: ProductosService,
    @InjectRepository(DetalleOrdenCompra)
    private readonly detalleordencompraRepository: Repository<DetalleOrdenCompra>,
  ) {}
  async create(
    createDetalleOrdenCompraDto: CreateDetalleOrdenCompraDto,
  ): Promise<VerDetalleOrdenCompraDto> {
    const detalleCarrito = await VentaMappers.dtotoEntityDetalle(
      createDetalleOrdenCompraDto,
      this.productoServices,
    );
    const carritoGuardado =
      await this.detalleordencompraRepository.save(detalleCarrito);
    return VentaMappers.entityToDtoOrdenDetalle(carritoGuardado);
  }
  async findOneOC(idOrdenCompra: number): Promise<DetalleOrdenCompra> {
    const orden = await this.detalleordencompraRepository.findOneBy({
      idOrdenCompra,
    });
    if (!orden) {
      return null;
    }
    return orden;
  }
  async findOneProductOC(
    idOrdenCompra: number,
    idProducto: number,
  ): Promise<DetalleOrdenCompra> {
    const orden = await this.detalleordencompraRepository.findOne({
      where: {
        idOrdenCompra: idOrdenCompra,
        idProducto: idProducto,
      },
    });
    if (!orden) {
      return null;
    }
    return orden;
  }
  async eliminaProductoDetalle(
    idOrdenCompra: number,
    idProducto: number,
  ): Promise<{ mensaje: string }> {
    const orden = await this.findOneProductOC(idOrdenCompra, idProducto);
    await this.detalleordencompraRepository.remove(orden);
    return {
      mensaje: `Producto con ID ${idProducto} ha sido eliminado del carrito.`,
    };
  }
  async actualizarDetalleOrdenCompra(
    actulizaProductoCarritoDto: CreateDetalleOrdenCompraDto,
  ): Promise<{ mensaje: string }> {
    if (actulizaProductoCarritoDto.cantidad == 0) {
      this.eliminaProductoDetalle(
        actulizaProductoCarritoDto.idOrden,
        actulizaProductoCarritoDto.idProducto,
      );
    }
    const detalleOrdenCompra = await this.detalleordencompraRepository.findOne({
      where: {
        idOrdenCompra: actulizaProductoCarritoDto.idOrden,
        idProducto: actulizaProductoCarritoDto.idProducto,
      },
    });
    const detalleActualizado = await VentaMappers.dtotoEntityDetalle(
      actulizaProductoCarritoDto,
      this.productoServices,
    );
    await this.detalleordencompraRepository.save(detalleActualizado);
    return {
      mensaje: `Producto con ID ${actulizaProductoCarritoDto.idProducto} ha sido actulizado del carrito.`,
    };
  }
}
