import { Injectable } from '@nestjs/common';
import { CreateOrdenCompraDto } from '../dto/create-orden-compra.dto';
import { OrdenCompra } from '../entities/orden_compra.entity';
import { ErrorPlantopia } from 'src/comunes/error-plantopia/error-plantopia';
import { DetalleOrdenCompra } from '../entities/detalle_orden_compra.entity';
import { ProductosService } from 'src/productos/service/productos.service';
import { DetalleOrdenComprasService } from './detalle-orden-compras.service';
import { CreateDetalleOrdenCompraDto } from '../dto/create-detalle-orden-compra.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetOrdenDto } from '../dto/getOrden.dto';
import { Venta } from '../entities/venta.entity';
import { VentaMappers } from '../mappers/ventas.mappers';
import { EstadoOrden } from '../enum/estadosOC';
import { GetOrdenCompraConDetalleDto } from '../dto/VerOrdenCompra.dto';
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
  ) {}
  async create(
    createOrdenCompraDto: CreateOrdenCompraDto,
  ): Promise<GetOrdenDto> {
    const carrito = await VentaMappers.dtotoEntityOrden(createOrdenCompraDto);
    const carritoGuardado = await this.ordencompraRepository.save(carrito);
    return VentaMappers.entityToDtoOrden(carritoGuardado);
  }
  async findOneOC(id: number): Promise<OrdenCompra> {
    console.log('Buscando orden con id:', id);
    const orden = await this.ordencompraRepository.findOneBy({ id });
    console.log('Resultado de la búsqueda:', orden);
    if (!orden) {
      return null;
    }
    return orden;
  }
  async buscarCarrito(
    emailComprador: string,
    idUsuario: number,
  ): Promise<GetOrdenCompraConDetalleDto[]> {
    const ordenCompra = await this.ordencompraRepository.find({
      where: [
        { idUsuario: idUsuario, estado: EstadoOrden.CREADA },
        { emailComprador: emailComprador, estado: EstadoOrden.CREADA },
      ],
      relations: ['detallesOrden'],
    });
    return ordenCompra.map((orden) => VentaMappers.buscarOrden(orden));
  }
}
