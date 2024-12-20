import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from 'src/productos/dto/create-producto.dto';
import { CreateMaceteroDto } from 'src/productos/dto/create-macetero.dto';
import { Macetero } from 'src/productos/entities/macetero.entity';
import { UpdateMaceteroDto } from 'src/productos/dto/update-macetero.dto';
import { Categoria } from 'src/productos/entities/categoria.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { gestionPaginacion } from 'src/comunes/paginacion/gestion-paginacion';

@Injectable()
export class MaceterosService {
  private readonly logger = new Logger(MaceterosService.name);

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
    this.logger.log(
      `Creando un nuevo macetero: ${JSON.stringify(createMaceteroDto)}`,
    );
    try {
      const categoriaMacetero = await this.categoriaRepository.findOne({
        where: { nombreCategoria: 'Maceteros' },
      });

      if (!categoriaMacetero) {
        this.logger.warn('Categoría de maceteros no encontrada');
        throw new NotFoundException('Categoría de maceteros no encontrada');
      }

      const createProductoDto: CreateProductoDto = {
        ...createMaceteroDto,
        idCategoria: categoriaMacetero.id,
      };

      const producto = this.productoRepository.create(createProductoDto);

      const nuevoMacetero = this.maceteroRepository.create({
        ...createMaceteroDto,
        producto,
        formamacetero: { id: createMaceteroDto.idForma } as any,
      });

      const savedMacetero = await this.maceteroRepository.save(nuevoMacetero);
      this.logger.log(
        `Macetero creado exitosamente con ID ${savedMacetero.id}`,
      );
      return savedMacetero;
    } catch (error) {
      this.logger.error('Error al crear el macetero', error.stack);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message:
            'Error al crear el macetero. Verifique los datos proporcionados.',
          details: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getMaceterosPaginados2(
    page: number,
    size: number,
  ): Promise<{ data: Macetero[]; total: number }> {
    this.logger.log(
      `Consultando maceteros paginados: página ${page}, tamaño ${size}`,
    );
    try {
      const result = await gestionPaginacion(
        this.maceteroRepository,
        page,
        size,
        ['producto', 'producto.categoria', 'producto.imagenes'],
      );
      this.logger.log(
        `Maceteros obtenidos: ${result.data.length}, Total: ${result.total}`,
      );
      return result;
    } catch (error) {
      this.logger.error('Error al consultar maceteros paginados', error.stack);
      throw new BadRequestException(
        `Error al consultar maceteros: ${error.message}. Verifique los parámetros.`,
      );
    }
  }

  async findMaceteroById(productoId: number): Promise<Macetero> {
    this.logger.log(`Buscando macetero con producto ID ${productoId}`);
    try {
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
        this.logger.warn(
          `Macetero con producto ID ${productoId} no encontrado`,
        );
        throw new NotFoundException(
          `Macetero con producto ID ${productoId} no encontrado`,
        );
      }

      this.logger.log(`Macetero encontrado: ${JSON.stringify(macetero)}`);
      return macetero;
    } catch (error) {
      this.logger.error(
        `Error al buscar macetero con producto ID ${productoId}`,
        error.stack,
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Error inesperado al buscar macetero.`,
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateMacetero(
    id: number,
    updateMaceteroDto: UpdateMaceteroDto,
  ): Promise<Macetero> {
    this.logger.log(
      `Actualizando macetero con ID ${id}: ${JSON.stringify(updateMaceteroDto)}`,
    );
    try {
      const macetero = await this.maceteroRepository.findOneBy({ id });
      if (!macetero) {
        this.logger.warn(`Macetero con ID ${id} no encontrado`);
        throw new NotFoundException(`Macetero con ID ${id} no encontrado`);
      }

      const producto = await this.productoRepository.findOneBy({
        id: macetero.producto.id,
      });
      if (!producto) {
        this.logger.warn(
          `Producto asociado con ID ${macetero.producto.id} no encontrado`,
        );
        throw new NotFoundException(
          `Producto asociado con ID ${macetero.producto.id} no encontrado`,
        );
      }

      Object.assign(producto, updateMaceteroDto);
      await this.productoRepository.save(producto);

      Object.assign(macetero, updateMaceteroDto);
      const updatedMacetero = await this.maceteroRepository.save(macetero);
      this.logger.log(`Macetero con ID ${id} actualizado exitosamente`);
      return updatedMacetero;
    } catch (error) {
      this.logger.error(
        `Error al actualizar macetero con ID ${id}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteMacetero(id: number): Promise<void> {
    this.logger.log(`Eliminando macetero con ID ${id}`);
    try {
      const result = await this.maceteroRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Macetero con ID ${id} no encontrado`);
        throw new NotFoundException(`Macetero con ID ${id} no encontrado`);
      }
      this.logger.log(`Macetero con ID ${id} eliminado exitosamente`);
    } catch (error) {
      this.logger.error(`Error al eliminar macetero con ID ${id}`, error.stack);
      throw error;
    }
  }
  //todo: Paginacion de maceteros - ANTERIOR
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
}
