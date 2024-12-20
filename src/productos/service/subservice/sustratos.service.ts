import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSustratoDto } from '../../dto/create-sustrato.dto';
import { UpdateSustratoDto } from '../../dto/update-sustrato.dto';
import { Sustrato } from '../../entities/sustrato.entity';
import { Producto } from '../../entities/producto.entity';
import { Categoria } from '../../entities/categoria.entity';
import { CreateProductoDto } from '../../dto/create-producto.dto';

@Injectable()
export class SustratosService {
  constructor(
    @InjectRepository(Sustrato)
    private readonly sustratoRepository: Repository<Sustrato>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async createSustrato(
    createSustratoDto: CreateSustratoDto,
  ): Promise<Sustrato> {
    const categoriaSustrato = await this.categoriaRepository.findOne({
      where: { nombreCategoria: 'Sustratos' },
    });
    if (!categoriaSustrato) {
      throw new NotFoundException('Categoría de sustratos no encontrada');
    }
    const createProductoDto: CreateProductoDto = {
      nombreProducto: createSustratoDto.nombre,
      descripcionProducto: createSustratoDto.descripcion,
      idCategoria: categoriaSustrato.id,
      imagenProducto: createSustratoDto.imagenProducto,
      precioNormal: createSustratoDto.precioNormal,
      stock: createSustratoDto.stock,
      activo: 1,
    };
    const producto = await this.createProducto(createProductoDto);

    const nuevoSustrato = this.sustratoRepository.create({
      ...createSustratoDto,
      producto,
    });

    return await this.sustratoRepository.save(nuevoSustrato);
  }

  async findAllSustratos(
    page: number,
    size: number,
  ): Promise<{ data: Sustrato[]; total: number }> {
    const [result, total] = await this.sustratoRepository.findAndCount({
      relations: ['producto', 'producto.categoria', 'producto.imagenes'],
      skip: (page - 1) * size,
      take: size,
    });

    return {
      data: result,
      total,
    };
  }

  async findSustratoById(idProducto: number): Promise<Sustrato> {
    const sustrato = await this.sustratoRepository.findOne({
      where: {
        producto: {
          id: idProducto,
          categoria: { nombreCategoria: 'Sustratos' },
        },
      },
      relations: ['producto', 'producto.categoria', 'producto.imagenes'],
    });

    if (!sustrato) {
      throw new NotFoundException(
        `Sustrato con ID de producto ${idProducto} no encontrado`,
      );
    }

    return sustrato;
  }

  async updateSustrato(
    id: number,
    updateSustratoDto: UpdateSustratoDto,
  ): Promise<Sustrato> {
    const sustrato = await this.sustratoRepository.findOneBy({ id });
    if (!sustrato) {
      throw new NotFoundException(`Sustrato con ID ${id} no encontrado`);
    }

    Object.assign(sustrato, updateSustratoDto);
    return await this.sustratoRepository.save(sustrato);
  }

  async deleteSustrato(id: number): Promise<void> {
    const result = await this.sustratoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Sustrato con ID ${id} no encontrado`);
    }
  }

  private async createProducto(
    createProductoDto: CreateProductoDto,
  ): Promise<Producto> {
    const nuevoProducto = this.productoRepository.create({
      ...createProductoDto,
      categoria: { id: createProductoDto.idCategoria } as any,
    });

    return await this.productoRepository.save(nuevoProducto);
  }
}
