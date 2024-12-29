import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFertilizanteDto } from 'src/productos/dto/create-fertilizante.dto';
import { CreateProductoDto } from 'src/productos/dto/create-producto.dto';
import { UpdateFertilizanteDto } from 'src/productos/dto/update-fertilizante.dto';
import { Fertilizante } from 'src/productos/entities/fertilizante.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FertilizantesService {
  private readonly logger = new Logger(FertilizantesService.name);

  constructor(
    @InjectRepository(Fertilizante)
    private readonly fertilizanteRepository: Repository<Fertilizante>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async createFertilizante(
    createFertilizanteDto: CreateFertilizanteDto,
  ): Promise<Fertilizante> {
    this.logger.verbose(
      `Iniciando creación de fertilizante: ${JSON.stringify(createFertilizanteDto)}`,
    );

    const createProductoDto: CreateProductoDto = {
      ...createFertilizanteDto,
      idCategoria: 5,
    };

    const producto = await this.createProducto(createProductoDto);
    this.logger.verbose(`Producto base creado con ID: ${producto.id}`);

    const tipoFertilizante = await this.fertilizanteRepository.findOneBy({
      id: createFertilizanteDto.idTipoFertilizante,
    });

    if (!tipoFertilizante) {
      this.logger.log(
        `Tipo de fertilizante no encontrado: ${createFertilizanteDto.idTipoFertilizante}`,
      );
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

    const fertilizanteGuardado =
      await this.fertilizanteRepository.save(nuevoFertilizante);
    this.logger.log(
      `Fertilizante creado exitosamente con ID: ${fertilizanteGuardado.id}`,
    );
    return fertilizanteGuardado;
  }

  async getFertilizantesPaginados(
    page: number,
    size: number,
  ): Promise<{ data: Fertilizante[]; total: number }> {
    this.logger.verbose(
      `Obteniendo fertilizantes paginados - Página: ${page}, Tamaño: ${size}`,
    );

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

    this.logger.log(
      `Se encontraron ${total} fertilizantes en total. Retornando ${result.length} registros`,
    );
    return {
      data: result,
      total,
    };
  }

  async findFertilizanteById(idProducto: number): Promise<Fertilizante> {
    this.logger.verbose(
      `Iniciando búsqueda de fertilizante por ID de producto: ${idProducto}`,
    );

    try {
      const fertilizante = await this.fertilizanteRepository
        .createQueryBuilder('fertilizante')
        .leftJoinAndSelect('fertilizante.producto', 'producto')
        .leftJoinAndSelect('producto.categoria', 'categoria')
        .leftJoinAndSelect('producto.imagenes', 'imagenes')
        .where('producto.id = :idProducto', { idProducto })
        .andWhere('producto.activo = :activo', { activo: 1 })
        .getOne();

      if (!fertilizante) {
        this.logger.warn(
          `No se encontró fertilizante con ID de producto: ${idProducto}`,
        );
        throw new NotFoundException(
          `Fertilizante con ID de producto ${idProducto} no encontrado`,
        );
      }

      this.logger.debug(
        `Fertilizante encontrado exitosamente para producto ID: ${idProducto}`,
      );
      return fertilizante;
    } catch (error) {
      this.logger.error(
        `Error al buscar fertilizante por ID de producto: ${idProducto}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al procesar la solicitud');
    }
  }

  async findFertilizanteByProductoId(
    idProducto: number,
  ): Promise<Fertilizante> {
    this.logger.debug(
      `Iniciando búsqueda de fertilizante por ID de producto: ${idProducto}`,
    );

    try {
      // Primero verificamos si el producto existe
      const producto = await this.productoRepository.findOne({
        where: { id: idProducto },
        relations: ['categoria'],
      });

      this.logger.debug(`Producto encontrado: ${JSON.stringify(producto)}`);

      // Luego buscamos el fertilizante
      const fertilizante = await this.fertilizanteRepository
        .createQueryBuilder('fertilizante')
        .innerJoinAndSelect('fertilizante.producto', 'producto')
        .leftJoinAndSelect('producto.categoria', 'categoria')
        .leftJoinAndSelect('producto.imagenes', 'imagenes')
        .where('producto.id = :idProducto', { idProducto })
        .getOne();

      this.logger.debug(
        `Resultado de la búsqueda de fertilizante: ${JSON.stringify(fertilizante)}`,
      );

      if (!fertilizante) {
        this.logger.warn(
          `No se encontró fertilizante con ID de producto: ${idProducto}`,
        );
        throw new NotFoundException(
          `Fertilizante con ID de producto ${idProducto} no encontrado`,
        );
      }

      this.logger.debug(
        `Fertilizante encontrado exitosamente para producto ID: ${idProducto}`,
      );
      return fertilizante;
    } catch (error) {
      this.logger.error(
        `Error al buscar fertilizante por ID de producto: ${idProducto}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateFertilizante(
    id: number,
    updateFertilizanteDto: UpdateFertilizanteDto,
  ): Promise<Fertilizante> {
    this.logger.verbose(`Iniciando actualización de fertilizante ID: ${id}`);
    this.logger.verbose(
      `Datos de actualización: ${JSON.stringify(updateFertilizanteDto)}`,
    );

    const fertilizante = await this.fertilizanteRepository.findOneBy({ id });
    if (!fertilizante) {
      this.logger.log(
        `No se encontró fertilizante para actualizar con ID: ${id}`,
      );
      throw new NotFoundException(`Fertilizante con ID ${id} no encontrado`);
    }

    Object.assign(fertilizante, updateFertilizanteDto);
    const fertilizanteActualizado =
      await this.fertilizanteRepository.save(fertilizante);
    this.logger.log(`Fertilizante actualizado exitosamente ID: ${id}`);
    return fertilizanteActualizado;
  }

  async deleteFertilizante(id: number): Promise<void> {
    this.logger.verbose(`Intentando eliminar fertilizante con ID: ${id}`);

    const result = await this.fertilizanteRepository.delete(id);
    if (result.affected === 0) {
      this.logger.log(
        `No se encontró fertilizante para eliminar con ID: ${id}`,
      );
      throw new NotFoundException(`Fertilizante con ID ${id} no encontrado`);
    }

    this.logger.log(`Fertilizante eliminado exitosamente ID: ${id}`);
  }

  private async createProducto(
    createProductoDto: CreateProductoDto,
  ): Promise<Producto> {
    this.logger.verbose(
      `Creando producto base: ${JSON.stringify(createProductoDto)}`,
    );

    const nuevoProducto = this.productoRepository.create({
      ...createProductoDto,
      categoria: { id: createProductoDto.idCategoria } as any,
    });

    const productoGuardado = await this.productoRepository.save(nuevoProducto);
    this.logger.log(
      `Producto base creado exitosamente con ID: ${productoGuardado.id}`,
    );
    return productoGuardado;
  }
}
