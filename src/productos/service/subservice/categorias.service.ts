import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from 'src/productos/entities/categoria.entity';
import { CreateCategoriaDto } from 'src/productos/dto/create-categoria.dto';
import { UpdateCategoriaDto } from 'src/productos/dto/update-categoria.dto';


@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async createCategoria(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<Categoria> {
    const nuevaCategoria = this.categoriaRepository.create(createCategoriaDto);
    return await this.categoriaRepository.save(nuevaCategoria);
  }

  async updateCategoria(
    id: number,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOneBy({ id });
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    Object.assign(categoria, updateCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  async deleteCategoria(id: number): Promise<void> {
    const result = await this.categoriaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
  }

  async findAllCategorias(
    page: number,
    size: number,
  ): Promise<{ data: Categoria[]; total: number }> {
    return this.gestionPaginacion(this.categoriaRepository, page, size);
  }

  async findCategoriaById(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOneBy({ id });
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return categoria;
  }

  async findCategoriaIdByName(nombreCategoria: string): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { nombreCategoria },
    });
    if (!categoria) {
      throw new NotFoundException(
        `Categoría con nombre ${nombreCategoria} no encontrada`,
      );
    }
    return categoria;
  }

  private async gestionPaginacion<T>(
    repository: Repository<T>,
    page: number,
    size: number,
  ): Promise<{ data: T[]; total: number }> {
    const queryBuilder = repository.createQueryBuilder('categoria');

    queryBuilder.skip((page - 1) * size);
    queryBuilder.take(size);

    const [result, total] = await queryBuilder.getManyAndCount();

    return {
      data: result,
      total,
    };
  }
}
