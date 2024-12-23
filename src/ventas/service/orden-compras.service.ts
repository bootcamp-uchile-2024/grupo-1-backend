import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateOrdenCompraDto } from '../dto/create-orden-compra.dto';
import { OrdenCompra } from '../entities/orden_compra.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetOrdenDto } from '../dto/getOrden.dto';
import { VentaMappers } from '../mappers/ventas.mappers';
import { EstadoOrden } from '../enum/estadosOC';
import { GetOrdenCompraConDetalleDto } from '../dto/verOrdenCompra.dto';
import { Producto } from 'src/productos/entities/producto.entity';
import { ProductosService } from 'src/productos/service/productos.service';
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
  logger: any;
  constructor(
    @InjectRepository(OrdenCompra)
    private readonly ordencompraRepository: Repository<OrdenCompra>,

    private readonly productoServices: ProductosService,
  ) {}
  async create(
    createOrdenCompraDto: CreateOrdenCompraDto,
  ): Promise<GetOrdenDto> {
    const timestamp = new Date().toISOString();

    /*this.logger.log(
      `${timestamp} INFO [ordenCompraServices] Iniciando creacion de carrito de compras`,
    );*/
    const carroVigente = await this.buscarCarrito(
      createOrdenCompraDto.emailComprador,
      createOrdenCompraDto.idUsuario,
    );
    /*this.logger.log(
      `${timestamp} INFO [ordenCompraServices] Buscando carrito en curso.`,
    );*/
    if (carroVigente && carroVigente.length > 0) {
      /*this.logger.warn(
        `${timestamp} WARN [ordenCompraServices] Carrito de compra no encontrado`,
      );*/
      throw new NotFoundException(
        'Ya existe carrito creado para el usuario o email',
      );
    }
    const carrito = await VentaMappers.dtotoEntityOrden(createOrdenCompraDto);
    const carritoGuardado = await this.ordencompraRepository.save(carrito);
    /*this.logger.log(
      `${timestamp} INFO [ordenCompraServices] Carrito de carrito de compras creado`,
    );*/
    return VentaMappers.entityToDtoOrden(carritoGuardado);
  }
  async findOneOC(id: number): Promise<OrdenCompra> {
    /*this.logger.log(
      `${timestamp} INFO [ordenCompraServices] Iniciando busqueda de carrito de compras`,
    );*/
    const orden = await this.ordencompraRepository.findOneBy({ id });
    if (!orden) {
      /*this.logger.log(
      `${timestamp} INFO [ordenCompraServices] Carrito de compras no encontrado`,
    );*/
      return null;
    }
    /*this.logger.log(
      `${timestamp} INFO [ordenCompraServices] Carrito de compras  encontrado`,
    );*/

    return orden;
  }
  async buscarCarrito(
    emailComprador: string,
    idUsuario: number,
  ): Promise<GetOrdenCompraConDetalleDto[]> {
    let whereCondition = [];

    if (idUsuario) {
      whereCondition.push({ idUsuario, estado: EstadoOrden.CREADA });
    }
    if (emailComprador) {
      whereCondition.push({ emailComprador, estado: EstadoOrden.CREADA });
    }

    const ordenCompra = await this.ordencompraRepository.find({
      where:
        whereCondition.length > 1 ? { $or: whereCondition } : whereCondition[0],
      relations: ['detallesOrden'],
    });

    return ordenCompra.map((orden) => VentaMappers.buscarOrden(orden));
  }

  async finalizaCarrito(idOc: number): Promise<GetOrdenCompraConDetalleDto[]> {
    /*this.logger.log(
      `${timestamp} INFO [ordenCompraServices] Inicio paso a portal de pagos del Carrito de compras seleccionado`,
    );*/
    const query = this.ordencompraRepository
      .createQueryBuilder('ordenCompra')
      .leftJoinAndSelect('ordenCompra.detallesOrden', 'detallesOrden');

    if (idOc) {
      query.orWhere('ordenCompra.id = :idOc', { idOc });
    }
    query.andWhere('ordenCompra.estado = :estado', {
      estado: EstadoOrden.CREADA,
    });

    const ordenCompra = await query.getMany();
    if (ordenCompra.length == 0) {
      /*
      this.logger.warn(
        `${timestamp} WARN [ventasServices] Carrito de compra no encontrado`,
      );*/
      throw new BadRequestException(
        `Carrito con ID ${idOc} no puede ser procesado`,
      );
    }
    /*this.logger.log(
      `${timestamp} INFO [ordenCompraServices]  Inicia validacion stock de productos del carrito de compras`,
    );*/
    for (const orden of ordenCompra) {
      for (const detalle of orden.detallesOrden) {
        try {
          const hayStock = await this.productoServices.validaStock(
            detalle.idProducto,
            detalle.cantidad,
          );

          if (!hayStock) {
            /*this.logger.log(
                            `${timestamp} WARN [ordenCompraServices]  Stock insuficiente de producto  ${detalle.idProducto}  del carrito de compras`,
                             );*/

            throw new BadRequestException(
              `El producto con ID ${detalle.idProducto} no tiene suficiente stock para cubrir la cantidad solicitada (${detalle.cantidad}).`,
            );
          }
        } catch (error) {
          console.error('Error validando stock:', error.message);

          if (error instanceof NotFoundException) {
            /*this.logger.log(
                            `${timestamp} WARN [ordenCompraServices]  Producto no existe`,
                     );*/
            throw new BadRequestException(
              `El producto con ID ${detalle.idProducto} no existe.`,
            );
          }

          throw error;
        }
      }
    }
    /*this.logger.log(
                            `${timestamp} INFO [ordenCompraServices] Actualizacion estado carrito de compras`,
                     );*/
    await this.ordencompraRepository.update(idOc, {
      estado: EstadoOrden.PROCESANDO,
    });
    const query2 = this.ordencompraRepository
      .createQueryBuilder('ordenCompra')
      .leftJoinAndSelect('ordenCompra.detallesOrden', 'detallesOrden')
      .andWhere('ordenCompra.id = :idOc', { idOc })
      .andWhere('ordenCompra.estado = :estado', {
        estado: EstadoOrden.PROCESANDO,
      });
    const ordenCompra2 = await query2.getMany();
    return ordenCompra2.map((orden) => VentaMappers.buscarOrden(orden));
  }

  /************************* */

  async historialCompras(
    emailComprador: string,
    idUsuario: number,
  ): Promise<GetOrdenCompraConDetalleDto[]> {
    let whereCondition = [];

    if (idUsuario) {
      whereCondition.push({ idUsuario, estado: EstadoOrden.COMPLETADO });
    }
    if (emailComprador) {
      whereCondition.push({ emailComprador, estado: EstadoOrden.COMPLETADO });
    }

    const ordenCompra = await this.ordencompraRepository.find({
      where:
        whereCondition.length > 1 ? { $or: whereCondition } : whereCondition[0],
      relations: ['detallesOrden'],
    });

    return ordenCompra.map((orden) => VentaMappers.buscarOrden(orden));
  }
}
