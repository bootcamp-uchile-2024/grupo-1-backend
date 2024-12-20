import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFertilizanteDto } from 'src/productos/dto/create-fertilizante.dto';
import { CreateProductoDto } from 'src/productos/dto/create-producto.dto';
import { UpdateFertilizanteDto } from 'src/productos/dto/update-fertilizante.dto';
import { Fertilizante } from 'src/productos/entities/fertilizante.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FertilizantesService {
  constructor(
    @InjectRepository(Fertilizante)
    private readonly fertilizanteRepository: Repository<Fertilizante>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async createFertilizante(
    createFertilizanteDto: CreateFertilizanteDto,
  ): Promise<Fertilizante> {
    const createProductoDto: CreateProductoDto = {
      ...createFertilizanteDto,
      idCategoria: 5,
    };

    const producto = await this.createProducto(createProductoDto);

    const tipoFertilizante = await this.fertilizanteRepository.findOneBy({
      id: createFertilizanteDto.idTipoFertilizante,
    });
    if (!tipoFertilizante) {
      throw new NotFoundException(
        `Tipo de fertilizante con ID ${createFertilizanteDto.idTipoFertilizante} no encontrado`,
      );
    }

    const nuevoFertilizante = this.fertilizanteRepository.create({
      producto,
      tipo: tipoFertilizante,
      composicion: createFertilizanteDto.composicion,
      presentacion: createFertilizanteDto.presentacion,
    });

    return await this.fertilizanteRepository.save(nuevoFertilizante);
  }

  async getFertilizantesPaginados(
    page: number,
    size: number,
  ): Promise<{ data: Fertilizante[]; total: number }> {
    const queryBuilder =
      this.fertilizanteRepository.createQueryBuilder('fertilizante');

    // Añadir condición para filtrar por 'activo = 1' en la entidad Producto
    queryBuilder
      .innerJoinAndSelect('fertilizante.producto', 'producto')
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

  async findFertilizanteById(id: number): Promise<Fertilizante> {
    const fertilizante = await this.fertilizanteRepository.findOne({
      where: { id },
      relations: ['producto', 'producto.categoria', 'producto.imagenes'],
    });

    if (!fertilizante) {
      throw new NotFoundException(`Fertilizante con ID ${id} no encontrado`);
    }

    return fertilizante;
  }

  async findFertilizanteByProductoId(
    idProducto: number,
  ): Promise<Fertilizante> {
    const fertilizante = await this.fertilizanteRepository.findOne({
      where: {
        producto: {
          id: idProducto,
          categoria: { nombreCategoria: 'Fertilizantes' },
        },
      },
      relations: ['producto', 'producto.categoria', 'producto.imagenes'],
    });

    if (!fertilizante) {
      throw new NotFoundException(
        `Fertilizante con ID de producto ${idProducto} no encontrado`,
      );
    }

    return fertilizante;
  }

  async updateFertilizante(
    id: number,
    updateFertilizanteDto: UpdateFertilizanteDto,
  ): Promise<Fertilizante> {
    const fertilizante = await this.fertilizanteRepository.findOneBy({ id });
    if (!fertilizante) {
      throw new NotFoundException(`Fertilizante con ID ${id} no encontrado`);
    }
    Object.assign(fertilizante, updateFertilizanteDto);
    return await this.fertilizanteRepository.save(fertilizante);
  }

  async deleteFertilizante(id: number): Promise<void> {
    const result = await this.fertilizanteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Fertilizante con ID ${id} no encontrado`);
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
