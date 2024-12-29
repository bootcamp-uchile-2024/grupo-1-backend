import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
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
  private readonly logger = new Logger(SustratosService.name);

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
    this.logger.verbose(
      `Iniciando creación de sustrato: ${JSON.stringify(createSustratoDto)}`,
    );

    const categoriaSustrato = await this.categoriaRepository.findOne({
      where: { nombreCategoria: 'Sustratos' },
    });
    if (!categoriaSustrato) {
      this.logger.log('Categoría de sustratos no encontrada');
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
    this.logger.verbose(`Producto base creado con ID: ${producto.id}`);

    const nuevoSustrato = this.sustratoRepository.create({
      ...createSustratoDto,
      producto,
    });

    const sustratoGuardado = await this.sustratoRepository.save(nuevoSustrato);
    this.logger.log(
      `Sustrato creado exitosamente con ID: ${sustratoGuardado.id}`,
    );
    return sustratoGuardado;
  }

  async findAllSustratos(
    page: number,
    size: number,
  ): Promise<{ data: Sustrato[]; total: number }> {
    this.logger.verbose(
      `Obteniendo sustratos paginados - Página: ${page}, Tamaño: ${size}`,
    );

    const [result, total] = await this.sustratoRepository.findAndCount({
      relations: ['producto', 'producto.categoria', 'producto.imagenes'],
      skip: (page - 1) * size,
      take: size,
    });

    this.logger.log(
      `Se encontraron ${total} sustratos en total. Retornando ${result.length} registros`,
    );
    return {
      data: result,
      total,
    };
  }

  async findSustratoById(idProducto: number): Promise<Sustrato> {
    this.logger.verbose(
      `Iniciando búsqueda de sustrato por ID de producto: ${idProducto}`,
    );

    try {
      const sustrato = await this.sustratoRepository
        .createQueryBuilder('sustrato')
        .leftJoinAndSelect('sustrato.producto', 'producto')
        .leftJoinAndSelect('producto.categoria', 'categoria')
        .leftJoinAndSelect('producto.imagenes', 'imagenes')
        .where('producto.id = :idProducto', { idProducto })
        .andWhere('producto.activo = :activo', { activo: 1 })
        .getOne();

      if (!sustrato) {
        this.logger.warn(
          `No se encontró sustrato con ID de producto: ${idProducto}`,
        );
        throw new NotFoundException(
          `Sustrato con ID de producto ${idProducto} no encontrado`,
        );
      }

      this.logger.debug(
        `Sustrato encontrado exitosamente para producto ID: ${idProducto}`,
      );
      return sustrato;
    } catch (error) {
      this.logger.error(
        `Error al buscar sustrato por ID de producto: ${idProducto}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al procesar la solicitud');
    }
  }

  async updateSustrato(
    id: number,
    updateSustratoDto: UpdateSustratoDto,
  ): Promise<Sustrato> {
    this.logger.verbose(`Iniciando actualización de sustrato ID: ${id}`);
    this.logger.verbose(
      `Datos de actualización: ${JSON.stringify(updateSustratoDto)}`,
    );

    const sustrato = await this.sustratoRepository.findOneBy({ id });
    if (!sustrato) {
      this.logger.log(`No se encontró sustrato para actualizar con ID: ${id}`);
      throw new NotFoundException(`Sustrato con ID ${id} no encontrado`);
    }

    Object.assign(sustrato, updateSustratoDto);
    const sustratoActualizado = await this.sustratoRepository.save(sustrato);
    this.logger.log(`Sustrato actualizado exitosamente ID: ${id}`);
    return sustratoActualizado;
  }

  async deleteSustrato(id: number): Promise<void> {
    this.logger.verbose(`Intentando eliminar sustrato con ID: ${id}`);

    const result = await this.sustratoRepository.delete(id);
    if (result.affected === 0) {
      this.logger.log(`No se encontró sustrato para eliminar con ID: ${id}`);
      throw new NotFoundException(`Sustrato con ID ${id} no encontrado`);
    }

    this.logger.log(`Sustrato eliminado exitosamente ID: ${id}`);
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
