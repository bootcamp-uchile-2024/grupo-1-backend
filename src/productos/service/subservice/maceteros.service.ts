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
    this.logger.log({
      message: `Creando un nuevo macetero: ${JSON.stringify(createMaceteroDto)}`,
      context: 'MaceterosService',
    });
    try {
      const categoriaMacetero = await this.categoriaRepository.findOne({
        where: { nombreCategoria: 'Maceteros' },
      });

      if (!categoriaMacetero) {
        this.logger.warn({
          message: 'Categoría de maceteros no encontrada',
          context: 'MaceterosService',
        });
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
      this.logger.log({
        message: `Macetero creado exitosamente con ID ${savedMacetero.id}`,
        context: 'MaceterosService',
      });
      return savedMacetero;
    } catch (error) {
      this.logger.error({
        message: 'Error al crear el macetero',
        context: 'MaceterosService',
        stack: error.stack,
      });
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

  async NewGetMaceterosPaginados(
    page: number,
    size: number,
  ): Promise<{ data: Macetero[]; total: number }> {
    this.logger.log({
      message: `Consultando maceteros paginados: página ${page}, tamaño ${size}`,
      context: 'MaceterosService',
    });

    try {
      const result = await gestionPaginacion(
        this.maceteroRepository,
        page,
        size,
        ['producto', 'producto.categoria', 'producto.imagenes'],
      );

      this.logger.log({
        message: `Maceteros obtenidos: ${result.data.length}, Total: ${result.total}`,
        context: 'MaceterosService',
      });

      return result;
    } catch (error) {
      this.logger.error({
        message: 'Error al consultar maceteros paginados',
        context: 'MaceterosService',
        stack: error.stack,
      });
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Error al consultar maceteros: ${error.message}. Verifique los parámetros.`,
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findMaceteroById(productoId: number): Promise<Macetero> {
    this.logger.log({
      message: `Buscando macetero con producto ID ${productoId}`,
      context: 'MaceterosService',
    });

    try {
      const macetero = await this.maceteroRepository.findOne({
        where: {
          producto: {
            id: productoId,
          },
        },
        relations: ['producto', 'producto.categoria', 'producto.imagenes'],
      });

      if (!macetero) {
        this.logger.warn({
          message: `Macetero con producto ID ${productoId} no encontrado`,
          context: 'MaceterosService',
        });
        throw new NotFoundException(
          `Macetero con producto ID ${productoId} no encontrado`,
        );
      }

      this.logger.log({
        message: `Macetero encontrado: ${JSON.stringify(macetero)}`,
        context: 'MaceterosService',
      });

      return macetero;
    } catch (error) {
      this.logger.error({
        message: `Error al buscar macetero con producto ID ${productoId}`,
        context: 'MaceterosService',
        stack: error.stack,
      });

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Error al obtener el macetero con ID ${productoId}.`,
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
    this.logger.log({
      message: `Actualizando macetero con ID ${id}: ${JSON.stringify(updateMaceteroDto)}`,
      context: 'MaceterosService',
    });
    try {
      const macetero = await this.maceteroRepository.findOneBy({ id });
      if (!macetero) {
        this.logger.warn({
          message: `Macetero con ID ${id} no encontrado`,
          context: 'MaceterosService',
        });
        throw new NotFoundException(`Macetero con ID ${id} no encontrado`);
      }

      const producto = await this.productoRepository.findOneBy({
        id: macetero.producto.id,
      });
      if (!producto) {
        this.logger.warn({
          message: `Producto asociado con ID ${macetero.producto.id} no encontrado`,
          context: 'MaceterosService',
        });
        throw new NotFoundException(
          `Producto asociado con ID ${macetero.producto.id} no encontrado`,
        );
      }

      Object.assign(producto, updateMaceteroDto);
      await this.productoRepository.save(producto);

      Object.assign(macetero, updateMaceteroDto);
      const updatedMacetero = await this.maceteroRepository.save(macetero);
      this.logger.log({
        message: `Macetero con ID ${id} actualizado exitosamente`,
        context: 'MaceterosService',
      });
      return updatedMacetero;
    } catch (error) {
      this.logger.error({
        message: `Error al actualizar macetero con ID ${id}`,
        context: 'MaceterosService',
        stack: error.stack,
      });
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Error al actualizar el macetero con ID ${id}.`,
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteMacetero(id: number): Promise<void> {
    this.logger.log({
      message: `Eliminando macetero con ID ${id}`,
      context: 'MaceterosService',
    });
    try {
      const result = await this.maceteroRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn({
          message: `Macetero con ID ${id} no encontrado`,
          context: 'MaceterosService',
        });
        throw new NotFoundException(`Macetero con ID ${id} no encontrado`);
      }
      this.logger.log({
        message: `Macetero con ID ${id} eliminado exitosamente`,
        context: 'MaceterosService',
      });
    } catch (error) {
      this.logger.error({
        message: `Error al eliminar macetero con ID ${id}`,
        context: 'MaceterosService',
        stack: error.stack,
      });
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Error al eliminar el macetero con ID ${id}.`,
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Paginación de maceteros - ANTERIOR
  async getMaceterosPaginados(
    page: number,
    size: number,
  ): Promise<{ data: Macetero[]; total: number }> {
    const queryBuilder = this.maceteroRepository.createQueryBuilder('macetero');

    queryBuilder
      .innerJoinAndSelect('macetero.producto', 'producto')
      .where('producto.activo = :activo', { activo: 1 });

    queryBuilder.leftJoinAndSelect('producto.categoria', 'categoria');
    queryBuilder.leftJoinAndSelect('producto.imagenes', 'imagenes');

    queryBuilder.skip((page - 1) * size);
    queryBuilder.take(size);

    const [result, total] = await queryBuilder.getManyAndCount();

    return {
      data: result,
      total,
    };
  }
}
