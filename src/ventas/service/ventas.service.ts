import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Venta } from '../entities/venta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVentaDto } from '../dto/create-venta-dto';
import { GetVentaDto } from '../dto/getVenta-dto';
import { OrdenCompra } from '../entities/orden_compra.entity';
import { ProductosService } from 'src/productos/service/productos.service';
import { EstadoOrden } from '../enum/estadosOC';
import { DetalleOrdenCompra } from '../entities/detalle_orden_compra.entity';
import { VentaMappers } from '../mappers/ventas.mappers';
import { FormaPago } from '../entities/forma_pago.entity';
import { EstadosVenta } from '../entities/estados_venta.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { JardinVirtual } from 'src/usuarios/entities/jardin_virtual.entity';
import { TipoProductos } from 'src/productos/enum/tipo-productos';
import { DetalleJardinVirtual } from 'src/usuarios/entities/detalle_jardin_virtual.entity';

@Injectable()
export class VentasService {
  fechaHoy = new Date();
  fechaActual =
    String(this.fechaHoy.getFullYear()) +
    '-' +
    String(this.fechaHoy.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(this.fechaHoy.getDate()).padStart(2, '0');
  logger: any;
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(OrdenCompra)
    private readonly ordenCompraRepository: Repository<OrdenCompra>,
    @InjectRepository(DetalleOrdenCompra)
    private readonly detalleOrdenCompraRepository: Repository<DetalleOrdenCompra>,
    @InjectRepository(FormaPago)
    private readonly formaPagoRepository: Repository<FormaPago>,
    @InjectRepository(EstadosVenta)
    private readonly estadosVentaRepository: Repository<EstadosVenta>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(JardinVirtual)
    private readonly jardinVirtualRepository: Repository<JardinVirtual>,
    @InjectRepository(DetalleJardinVirtual)
    private readonly detalleJardinVirtualRepository: Repository<DetalleJardinVirtual>,
    private readonly productoServices: ProductosService,
  ) {}
  async createVenta(createVentaDto: CreateVentaDto): Promise<GetVentaDto> {
    const timestamp = new Date().toISOString();
    let jardinVirtual: JardinVirtual | undefined;
    /*this.logger.log(
      `${timestamp} INFO [ventasServices] Iniciando traspaso de carrito compra a venta realizada`,
    );*/
    const idOrden = createVentaDto.idOrden;
    const ordenCompra = await this.ordenCompraRepository
      .createQueryBuilder('ordenCompra')
      .leftJoinAndSelect('ordenCompra.detallesOrden', 'detallesOrden') // Unir detalles de la orden
      .leftJoinAndSelect('ordenCompra.usuario', 'usuario') // Unir usuario, incluso si es null
      .where('ordenCompra.id = :idOrden', { idOrden })
      .andWhere('ordenCompra.estado = :estado', {
        estado: EstadoOrden.PROCESANDO,
      })
      .getOne();

    if (!ordenCompra) {
      throw new NotFoundException(
        `Carrito con ID ${idOrden} no puede ser procesado`,
      );
    }
    const detallesActualiza = [];
    // Si no hay usuario, emitir advertencia y continuar
    if (!ordenCompra.usuario) {
      console.warn(
        `Advertencia: La orden de compra con ID ${idOrden} no tiene un usuario registrado.`,
      );
    } else {
      const usuarioId = ordenCompra.usuario.id;
      /* const jardinVirtual = await this.jardinVirtualRepository.findOne({
        where: { usuario: { id: usuarioId } },
        relations: ['usuario'],
      });
      if (!jardinVirtual) {
        const nuevoJardin = this.jardinVirtualRepository.create({
          usuario: { id: ordenCompra.usuario.id },
        });
        await this.jardinVirtualRepository.save(nuevoJardin);
      }*/
    }

    for (const detalle of ordenCompra.detallesOrden) {
      const hayStock = await this.productoServices.validaStock(
        detalle.idProducto,
        detalle.cantidad,
      );
      if (!hayStock) {
        await this.ordenCompraRepository.update(ordenCompra.id, {
          estado: EstadoOrden.VENTA_ANULADA,
        });
        throw new BadRequestException(
          `El producto con ID ${detalle.idProducto} no tiene suficiente stock.`,
        );
      }
      await this.productoRepository.update(detalle.idProducto, {
        stock: () => `stock - ${detalle.cantidad}`,
        cantidadVentas: () => `cantidadVentas + ${detalle.cantidad}`,
      });
      const producto = await this.productoRepository.findOne({
        where: { id: detalle.idProducto },
        relations: ['categoria'],
      });
      /*if (ordenCompra.usuario) {
        if (producto.categoria.nombreCategoria === TipoProductos.Planta) {
          const plantaYaRegistrada =
            await this.detalleJardinVirtualRepository.findOne({
              where: {
                idJardin: jardinVirtual.id,
                idPlanta: detalle.idProducto,
              },
            });
          if (!plantaYaRegistrada) {
            const nuevaPlanta = this.detalleJardinVirtualRepository.create({
              idJardin: jardinVirtual.id,
              idPlanta: detalle.idProducto,
              fechaIngreso: new Date(),
            });
            await this.detalleJardinVirtualRepository.save(nuevaPlanta);
          }
        }
      }*/

      detallesActualiza.push(detalle);
    }
    await this.ordenCompraRepository.update(ordenCompra.id, {
      estado: EstadoOrden.COMPLETADO,
    });
    let totalBruto = 0;
    let totalDescuento = 0;
    for (const detalle of detallesActualiza) {
      totalBruto += detalle.totalProducto;
      totalDescuento += detalle.descuento;
      await this.detalleOrdenCompraRepository.update(
        {
          idOrdenCompra: detalle.idOrdenCompra,
          idProducto: detalle.idProducto,
        },
        {
          cantidadVenta: () => `cantidadVenta + ${detalle.cantidad}`,
        },
      );
    }

    const iva = Math.round(totalBruto * 0.19);
    const totalPago = totalBruto + iva - totalDescuento;
    const formaPago = await this.formaPagoRepository.findOne({
      where: { id: createVentaDto.idFormaPago },
    });
    if (!formaPago) {
      throw new BadRequestException(
        `Forma de pago con ID ${createVentaDto.idFormaPago} no encontrada.`,
      );
    }
    const estadoVenta = await this.estadosVentaRepository.findOne({
      where: { id: 2 },
    });
    const ventaNueva = this.ventaRepository.create({
      totalBruto,
      totalDescuento,
      iva,
      totalPago,
      nroComprobantePago: createVentaDto.nroComprobantePago,
      ordenCompra,
      formaPago,
      estadoVenta,
    });
    const ventacreada = await this.ventaRepository.save(ventaNueva);
    const ventadto: GetVentaDto = {
      id: ventacreada.id,
      totalBruto: ventacreada.totalBruto,
      iva: ventacreada.iva,
      totalPago: ventacreada.totalPago,
      nroComprobantePago: ventaNueva.nroComprobantePago,
      idOrdenCompra: ventaNueva.ordenCompra.id,
      idFormaPago: ventaNueva.formaPago.id,
      idEstadoVenta: ventaNueva.estadoVenta.id,
    };
    return ventadto;
  }
}
