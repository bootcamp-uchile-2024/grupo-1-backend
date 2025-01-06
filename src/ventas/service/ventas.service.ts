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
  private readonly logger = new Logger(VentasService.name);

  fechaHoy = new Date();
  fechaActual =
    String(this.fechaHoy.getFullYear()) +
    '-' +
    String(this.fechaHoy.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(this.fechaHoy.getDate()).padStart(2, '0');
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
    this.logger.log(
      `[${timestamp}] Iniciando creación de venta: ${JSON.stringify(createVentaDto)}`,
    );

    try {
      let jardinVirtual: JardinVirtual | undefined;
      const idOrden = createVentaDto.idOrden;

      this.logger.log(`[${timestamp}] Buscando orden de compra ID: ${idOrden}`);
      const ordenCompra = await this.ordenCompraRepository
        .createQueryBuilder('ordenCompra')
        .leftJoinAndSelect('ordenCompra.detallesOrden', 'detallesOrden')
        .leftJoinAndSelect('ordenCompra.usuario', 'usuario')
        .where('ordenCompra.id = :idOrden', { idOrden })
        .andWhere('ordenCompra.estado = :estado', {
          estado: EstadoOrden.PROCESANDO,
        })
        .getOne();

      if (!ordenCompra) {
        this.logger.error(
          `[${timestamp}] Carrito ${idOrden} no encontrado o no procesable`,
        );
        throw new NotFoundException(
          `Carrito con ID ${idOrden} no puede ser procesado`,
        );
      }

      this.logger.log(`[${timestamp}] Validando stock de productos`);
      for (const detalle of ordenCompra.detallesOrden) {
        this.logger.log(
          `[${timestamp}] Validando stock producto ID: ${detalle.idProducto}`,
        );
        const hayStock = await this.productoServices.validaStock(
          detalle.idProducto,
          detalle.cantidad,
        );

        if (!hayStock) {
          this.logger.error(
            `[${timestamp}] Stock insuficiente para producto ID: ${detalle.idProducto}`,
          );
          await this.ordenCompraRepository.update(ordenCompra.id, {
            estado: EstadoOrden.VENTA_ANULADA,
          });
          throw new BadRequestException(
            `El producto con ID ${detalle.idProducto} no tiene suficiente stock.`,
          );
        }

        this.logger.log(
          `[${timestamp}] Actualizando stock producto ID: ${detalle.idProducto}`,
        );
        await this.productoRepository.update(detalle.idProducto, {
          stock: () => `stock - ${detalle.cantidad}`,
          cantidadVentas: () => `cantidadVentas + ${detalle.cantidad}`,
        });
      }

      this.logger.log(`[${timestamp}] Calculando totales de la venta`);
      let totalBruto = ordenCompra.detallesOrden.reduce(
        (sum, detalle) => sum + detalle.totalProducto,
        0,
      );
      let totalDescuento = ordenCompra.detallesOrden.reduce(
        (sum, detalle) => sum + detalle.descuento,
        0,
      );

      const iva = Math.round(totalBruto * 0.19);
      const totalPago = totalBruto + iva - totalDescuento;

      this.logger.log(
        `[${timestamp}] Verificando forma de pago ID: ${createVentaDto.idFormaPago}`,
      );
      const formaPago = await this.formaPagoRepository.findOne({
        where: { id: createVentaDto.idFormaPago },
      });

      if (!formaPago) {
        this.logger.error(
          `[${timestamp}] Forma de pago no encontrada ID: ${createVentaDto.idFormaPago}`,
        );
        throw new BadRequestException(
          `Forma de pago con ID ${createVentaDto.idFormaPago} no encontrada.`,
        );
      }

      this.logger.log(`[${timestamp}] Creando registro de venta`);
      const ventaNueva = this.ventaRepository.create({
        totalBruto,
        totalDescuento,
        iva,
        totalPago,
        nroComprobantePago: createVentaDto.nroComprobantePago,
        ordenCompra,
        formaPago,
        estadoVenta: { id: 2 },
      });

      const ventaCreada = await this.ventaRepository.save(ventaNueva);

      this.logger.log(
        `[${timestamp}] Venta creada exitosamente ID: ${ventaCreada.id}`,
      );
      return {
        id: ventaCreada.id,
        totalBruto: ventaCreada.totalBruto,
        iva: ventaCreada.iva,
        totalPago: ventaCreada.totalPago,
        nroComprobantePago: ventaCreada.nroComprobantePago,
        idOrdenCompra: ventaCreada.ordenCompra.id,
        idFormaPago: ventaCreada.formaPago.id,
        idEstadoVenta: ventaCreada.estadoVenta.id,
      };
    } catch (error) {
      this.logger.error(
        `[${timestamp}] Error en creación de venta: ${error.message}`,
      );
      throw error;
    }
  }
}
