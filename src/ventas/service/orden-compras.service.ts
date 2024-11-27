import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrdenCompraDto } from '../dto/create-orden-compra.dto';
import { OrdenCompra } from '../entities/orden_compra.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetOrdenDto } from '../dto/getOrden.dto';
import { VentaMappers } from '../mappers/ventas.mappers';
import { EstadoOrden } from '../enum/estadosOC';
import { GetOrdenCompraConDetalleDto } from '../dto/verOrdenCompra.dto';
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
}
