import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
  constructor(
    @InjectRepository(OrdenCompra)
    private readonly ordencompraRepository: Repository<OrdenCompra>,

    private readonly productoServices: ProductosService,
  ) {}
  async create(
    createOrdenCompraDto: CreateOrdenCompraDto,
  ): Promise<GetOrdenDto> {
    const carroVigente = await this.buscarCarrito(
      createOrdenCompraDto.emailComprador,
      createOrdenCompraDto.idUsuario,
    );
    if (carroVigente && carroVigente.length > 0) {
      throw new BadRequestException(
        'Ya existe carrito creado para el usuario o email',
      );
    }
    const carrito = await VentaMappers.dtotoEntityOrden(createOrdenCompraDto);
    const carritoGuardado = await this.ordencompraRepository.save(carrito);
    return VentaMappers.entityToDtoOrden(carritoGuardado);
  }
  async findOneOC(id: number): Promise<OrdenCompra> {
    const orden = await this.ordencompraRepository.findOneBy({ id });
    if (!orden) {
      return null;
    }
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
      throw new BadRequestException(
        `Carrito con ID ${idOc} no puede ser procesado`,
      );
    }
    for (const orden of ordenCompra) {
      for (const detalle of orden.detallesOrden) {
        try {
          const hayStock = await this.productoServices.validaStock(
            detalle.idProducto,
            detalle.cantidad,
          );

          if (!hayStock) {
            throw new BadRequestException(
              `El producto con ID ${detalle.idProducto} no tiene suficiente stock para cubrir la cantidad solicitada (${detalle.cantidad}).`,
            );
          }
        } catch (error) {
          console.error('Error validando stock:', error.message);

          if (error instanceof NotFoundException) {
            throw new BadRequestException(
              `El producto con ID ${detalle.idProducto} no existe.`,
            );
          }

          throw error; // Relanzar otros errores
        }
      }
    }
    await this.ordencompraRepository.update(idOc, {
      estado: EstadoOrden.PROCESANDO,
    });
    return ordenCompra.map((orden) => VentaMappers.buscarOrden(orden));
  }
}
