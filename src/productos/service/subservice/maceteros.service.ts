import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from 'src/productos/dto/create-producto.dto';
import { CreateMaceteroDto } from 'src/productos/dto/create-macetero.dto';
import { Macetero } from 'src/productos/entities/macetero.entity';
import { UpdateMaceteroDto } from 'src/productos/dto/update-macetero.dto';
import { Categoria } from 'src/productos/entities/categoria.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Injectable()
export class MaceterosService {
  constructor(
    @InjectRepository(Macetero)
    private readonly maceteroRepository: Repository<Macetero>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async createMacetero(
    createMaceteroDto: CreateMaceteroDto,
  ): Promise<Macetero> {
    const categoriaMacetero = await this.categoriaRepository.findOne({
      where: { nombreCategoria: 'Maceteros' },
    });
    if (!categoriaMacetero) {
      throw new NotFoundException('Categoría de maceteros no encontrada');
    }
    const createProductoDto: CreateProductoDto = {
      ...createMaceteroDto,
      idCategoria: categoriaMacetero.id,
    };

    const producto = await this.productoRepository.create(createProductoDto);

    const nuevoMacetero = this.maceteroRepository.create({
      ...createMaceteroDto,
      producto,
      formamacetero: { id: createMaceteroDto.idForma } as any,
    });

    return await this.maceteroRepository.save(nuevoMacetero);
  }

  async getMaceterosPaginados(
    page: number,
    size: number,
  ): Promise<{ data: Macetero[]; total: number }> {
    const queryBuilder = this.maceteroRepository.createQueryBuilder('macetero');

    // Añadir condición para filtrar por 'activo = 1' en la entidad Producto
    queryBuilder
      .innerJoinAndSelect('macetero.producto', 'producto')
      .where('producto.activo = :activo', { activo: 1 });

    // Añadir las relaciones adicionales
    queryBuilder.leftJoinAndSelect('producto.categoria', 'categoria');
    queryBuilder.leftJoinAndSelect('producto.imagenes', 'imagenes');

    // Paginación
    queryBuilder.skip((page - 1) * size);
    queryBuilder.take(size);

    // Ejecutar la consulta y contar los resultados
    const [result, total] = await queryBuilder.getManyAndCount();

    return {
      data: result,
      total,
    };
  }

  async findMaceteroById(productoId: number): Promise<Macetero> {
    const macetero = await this.maceteroRepository.findOne({
      where: {
        producto: {
          id: productoId,
          categoria: { nombreCategoria: 'Maceteros' },
        },
      },
      relations: ['producto', 'producto.categoria', 'producto.imagenes'],
    });

    if (!macetero) {
      throw new NotFoundException(
        `Macetero con ID de producto ${productoId} no encontrado`,
      );
    }

    return macetero;
  }

  async updateMacetero(
    id: number,
    updateMaceteroDto: UpdateMaceteroDto,
  ): Promise<Macetero> {
    const macetero = await this.maceteroRepository.findOneBy({ id });
    if (!macetero) {
      throw new NotFoundException(`Macetero con ID ${id} no encontrado`);
    }

    const producto = await this.productoRepository.findOneBy({
      id: macetero.producto.id,
    });
    if (!producto) {
      throw new NotFoundException(
        `Producto asociado con ID ${macetero.producto.id} no encontrado`,
      );
    }

    Object.assign(producto, updateMaceteroDto);
    await this.productoRepository.save(producto);

    Object.assign(macetero, updateMaceteroDto);
    return await this.maceteroRepository.save(macetero);
  }

  async deleteMacetero(id: number): Promise<void> {
    const result = await this.maceteroRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Macetero con ID ${id} no encontrado`);
    }
  }
}
