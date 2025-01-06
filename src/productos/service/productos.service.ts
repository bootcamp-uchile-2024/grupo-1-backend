import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Producto } from 'src/productos/entities/producto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DificultadDeCuidado } from '../entities/dificultad_de_cuidado.entity';
import { Estacion } from '../entities/estacion.entity';
import { Fertilizante } from '../entities/fertilizante.entity';
import { FrecuenciaDeRiego } from '../entities/frecuencia_de_riego.entity';
import { Habitat } from '../entities/habitat.entity';
import { LuzRequerida } from '../entities/luz_requerida.entity';
import { NivelDeHumedad } from '../entities/nivel_de_humedad.entity';
import { Planta } from '../entities/planta.entity';
import { Sustrato } from '../entities/sustrato.entity';
import { TipoDeSuelo } from '../entities/tipo_de_suelo.entity';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';
import { Categoria } from '../entities/categoria.entity';
import { ImagenProducto } from '../entities/imagen_producto.entity';
import { Macetero } from '../entities/macetero.entity';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import * as fs from 'fs';
import { CreateProd2Dto } from '../dto/create-prod2.dto';
import { gestionPaginacion } from 'src/comunes/paginacion/gestion-paginacion';

@Injectable()
export class ProductosService {
  private readonly logger = new Logger(ProductosService.name);

  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Planta)
    private readonly plantaRepository: Repository<Planta>,
    @InjectRepository(Habitat)
    private readonly habitatRepository: Repository<Habitat>,
    @InjectRepository(LuzRequerida)
    private readonly luzRepository: Repository<LuzRequerida>,
    @InjectRepository(NivelDeHumedad)
    private readonly humedadRepository: Repository<NivelDeHumedad>,
    @InjectRepository(DificultadDeCuidado)
    private readonly dificultadRepository: Repository<DificultadDeCuidado>,
    @InjectRepository(FrecuenciaDeRiego)
    private readonly frecuenciaRepository: Repository<FrecuenciaDeRiego>,
    @InjectRepository(Fertilizante)
    private readonly fertilizanteRepository: Repository<Fertilizante>,
    @InjectRepository(Sustrato)
    private readonly sustratoRepository: Repository<Sustrato>,
    @InjectRepository(Estacion)
    private readonly estacionRepository: Repository<Estacion>,
    @InjectRepository(TipoDeSuelo)
    private readonly sueloRepository: Repository<TipoDeSuelo>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(ImagenProducto)
    private imagenProductoRepository: Repository<ImagenProducto>,
    @InjectRepository(Macetero)
    private maceteroRepository: Repository<Macetero>,
    //private readonly imagePath: string,
    @Inject('IMAGE_PATH') private readonly imagePath: string, // Token registrado
  ) {}

  async addImageToProduct(
    productId: number,
    imageBase64: string,
  ): Promise<Producto> {
    this.logger.log(
      `Iniciando proceso de agregar imagen al producto ${productId}`,
    );
    const producto = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['imagenes'],
    });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const imageName = `${productId}-${Date.now()}.jpg`;
    const fullImagePath = path.join(this.imagePath, imageName);

    await fsPromises.mkdir(this.imagePath, { recursive: true });
    await fsPromises.writeFile(fullImagePath, imageBuffer);
    const nuevaImagen = this.imagenProductoRepository.create({
      urlImagen: `/images/${imageName}`,
      producto: producto,
    });
    await this.imagenProductoRepository.save(nuevaImagen);
    producto.imagenes.push(nuevaImagen);
    this.logger.log(`Imagen agregada exitosamente al producto ${productId}`);
    return await this.productoRepository.save(producto);
  }

  async editImageForProduct(
    productId: number,
    imageId: number,
    imageBase64: string,
  ): Promise<Producto> {
    this.logger.log(
      `Iniciando edición de imagen ${imageId} para producto ${productId}`,
    );
    const producto = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['imagenes'],
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    const imagenExistente = producto.imagenes.find(
      (img) => img.id === +imageId,
    );
    if (!imagenExistente) {
      throw new NotFoundException('Imagen no encontrada');
    }
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const imageName = `${productId}-${Date.now()}.jpg`;
    const fullImagePath = path.join(
      __dirname,
      '..',
      'public',
      'images',
      imageName,
    );
    await fsPromises.mkdir(path.dirname(fullImagePath), { recursive: true });
    await fsPromises.writeFile(fullImagePath, imageBuffer);
    imagenExistente.urlImagen = `/images/${imageName}`;
    await this.imagenProductoRepository.save(imagenExistente);
    this.logger.log(
      `Imagen ${imageId} actualizada exitosamente para producto ${productId}`,
    );
    return this.productoRepository.save(producto);
  }

  async deleteImageFromProduct(
    productId: number,
    imageId: number,
  ): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['imagenes'],
    });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    const imagenExistente = producto.imagenes.find(
      (img) => img.id === +imageId,
    );
    if (!imagenExistente) {
      throw new NotFoundException('Imagen no encontrada');
    }
    if (!imagenExistente.urlImagen.startsWith('http')) {
      const imagePath = path.join(
        __dirname,
        '..',
        'public',
        imagenExistente.urlImagen,
      );
      try {
        await fsPromises.unlink(imagePath);
      } catch (err) {
        throw new Error('Error al eliminar la imagen del sistema de archivos');
      }
    }
    await this.imagenProductoRepository.remove(imagenExistente);
    producto.imagenes = producto.imagenes.filter((img) => img.id !== +imageId);
    return await this.productoRepository.save(producto);
  }

  async findAllCatalogoPaginado(
    page: number,
    size: number,
  ): Promise<{ length: number; data: Producto[]; total: number }> {
    const skip = (page - 1) * size;

    const [productos, total] = await this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.imagenes', 'imagenes')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .where('producto.activo = :activo', { activo: 1 })
      .skip(skip)
      .take(size)
      .getManyAndCount();

    const result = {
      length: productos.length,
      data: productos,
      total: total,
    };

    return result;
  }

  // CATALOGO de productos
  // busca todos los productos
  async findallcatalogo(): Promise<Producto[]> {
    this.logger.log('Buscando todos los productos del catálogo');
    const productos = await this.productoRepository.find({
      relations: ['categoria', 'imagenes'],
    });
    this.logger.log(`Se encontraron ${productos.length} productos`);
    return productos;
  }

  // busca un producto por su id
  async porProducto(id: number): Promise<Producto[]> {
    this.logger.log(`Buscando producto por ID: ${id}`);
    const tipoProducto = await this.productoRepository.find({
      where: { id },
      relations: ['categoria'],
    });
    const categoriax = tipoProducto[0].categoria.id;
    let producto;

    if (categoriax == 1) {
      producto = await this.productoRepository.find({
        where: { id },
        relations: ['categoria', 'planta', 'imagenes', 'planta.estaciones'],
      });
    } else if (categoriax == 2) {
      producto = await this.productoRepository.find({
        where: { id },
        relations: ['categoria', 'controlplaga', 'imagenes'],
      });
    } else if (categoriax == 3) {
      producto = await this.productoRepository.find({
        where: { id },
        relations: ['categoria', 'macetero', 'imagenes'],
      });
    } else if (categoriax == 4) {
      producto = await this.productoRepository.find({
        where: { id },
        relations: ['categoria', 'sustrato', 'imagenes'],
      });
    } else if (categoriax == 5) {
      producto = await this.productoRepository.find({
        where: { id },
        relations: ['categoria', 'fertilizante', 'imagenes'],
      });
    }

    this.logger.log(`Producto encontrado con categoría: ${categoriax}`);
    return producto;
  }

  async findOneOC(id: number): Promise<Producto> {
    this.logger.log(`Buscando producto por ID: ${id}`);
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      this.logger.warn(`Producto con ID ${id} no encontrado`);
      return null;
    }
    this.logger.log(`Producto con ID ${id} encontrado exitosamente`);
    return producto;
  }

  async findallcatalogo222(categoriaNombre?: string): Promise<Producto[]> {
    this.logger.log(
      `Buscando productos por categoría: ${categoriaNombre || 'todas'}`,
    );
    let productos: Producto[];

    try {
      if (categoriaNombre) {
        const categoria = await this.categoriaRepository.findOne({
          where: { nombreCategoria: categoriaNombre },
        });

        if (!categoria) {
          this.logger.warn(`Categoría no encontrada: ${categoriaNombre}`);
          throw new NotFoundException(
            `Categoría ${categoriaNombre} no encontrada`,
          );
        }

        productos = await this.productoRepository.find({
          where: { categoria: { id: categoria.id } },
          relations: ['categoria', 'imagenes'],
        });
      } else {
        productos = await this.productoRepository.find({
          relations: ['categoria', 'imagenes'],
        });
      }

      this.logger.log(`Se encontraron ${productos.length} productos`);
      return productos;
    } catch (error) {
      this.logger.error(`Error al buscar productos: ${error.message}`);
      throw error;
    }
  }
  async findProductosByCategoriaId(idCategoria: number): Promise<Producto[]> {
    this.logger.log(`Buscando productos para categoría ID: ${idCategoria}`);
    try {
      const productos = await this.productoRepository.find({
        where: { categoria: { id: idCategoria } },
        relations: ['categoria', 'imagenes'],
      });

      if (!productos.length) {
        this.logger.warn(
          `No se encontraron productos para categoría ID: ${idCategoria}`,
        );
        throw new NotFoundException(
          `No hay productos para categoría ${idCategoria}`,
        );
      }

      this.logger.log(
        `Encontrados ${productos.length} productos para categoría ${idCategoria}`,
      );
      return productos;
    } catch (error) {
      this.logger.error(
        `Error buscando productos por categoría: ${error.message}`,
      );
      throw error;
    }
  }
  async deleteProducto(id: number): Promise<void> {
    this.logger.log(`Intentando eliminar producto ID: ${id}`);
    try {
      const result = await this.productoRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Producto ID ${id} no encontrado para eliminar`);
        throw new NotFoundException(`Producto ${id} no encontrado`);
      }
      this.logger.log(`Producto ${id} eliminado exitosamente`);
    } catch (error) {
      this.logger.error(`Error eliminando producto ${id}: ${error.message}`);
      throw error;
    }
  }
  async updateProducto(
    id: number,
    updateProductoDto: CreateProductoDto,
  ): Promise<Producto> {
    this.logger.log(
      `Actualizando producto ${id} con datos: ${JSON.stringify(updateProductoDto)}`,
    );
    try {
      const producto = await this.productoRepository.findOneBy({ id });
      if (!producto) {
        this.logger.warn(`Producto ${id} no encontrado para actualizar`);
        throw new NotFoundException(`Producto ${id} no encontrado`);
      }

      Object.assign(producto, updateProductoDto);
      const productoActualizado = await this.productoRepository.save(producto);
      this.logger.log(`Producto ${id} actualizado exitosamente`);
      return productoActualizado;
    } catch (error) {
      this.logger.error(`Error actualizando producto ${id}: ${error.message}`);
      throw error;
    }
  }
  //TODO: METODO PARA CREAR UN PRODUCTO JUNTO A LAS IMAGENES
  async creaProductoImagen(
    CreateProd2Dto: CreateProd2Dto,
    rutasImagenes: string[],
  ): Promise<Producto> {
    const queryRunner =
      this.productoRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const nuevoProducto = this.productoRepository.create({
        ...CreateProd2Dto,
        categoria: { id: CreateProd2Dto.idCategoria } as any,
        valoracion: CreateProd2Dto.valoracion ?? 0,
        cantidadVentas: CreateProd2Dto.cantidadVentas ?? 0,
      });

      const productoGuardado = await queryRunner.manager.save(nuevoProducto);

      if (rutasImagenes && rutasImagenes.length > 0) {
        const imagenesEntities = rutasImagenes.map((ruta) =>
          this.imagenProductoRepository.create({
            urlImagen: ruta,
            producto: productoGuardado,
          }),
        );
        await queryRunner.manager.save(imagenesEntities);
      }

      await queryRunner.commitTransaction();
      return productoGuardado;
    } catch (error) {
      this.logger.error(
        'Error durante la creación del producto con imágenes:',
        error,
      );
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        `Error al crear el producto con imágenes: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await queryRunner.release();
    }
  }
  async createProducto(
    createProductoDto: CreateProductoDto,
  ): Promise<Producto> {
    this.logger.log('Iniciando creación de nuevo producto');
    const queryRunner =
      this.productoRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // Crear el nuevo producto
      const nuevoProducto = this.productoRepository.create({
        ...createProductoDto,
        categoria: { id: createProductoDto.idCategoria } as any,
      });

      const productoGuardado = await queryRunner.manager.save(nuevoProducto);

      // Guardar las imágenes asociadas
      if (
        createProductoDto.imagenProducto &&
        createProductoDto.imagenProducto.length > 0
      ) {
        const imagenesEntities = createProductoDto.imagenProducto.map((url) =>
          this.imagenProductoRepository.create({
            urlImagen: url,
            producto: productoGuardado,
          }),
        );
        await queryRunner.manager.save(imagenesEntities);
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `Producto creado exitosamente con ID: ${productoGuardado.id}`,
      );
      return productoGuardado;
    } catch (error) {
      this.logger.error(`Error al crear producto: ${error.message}`);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        `Error al crear el producto: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await queryRunner.release();
    }
  }
  async getNextProductoId(): Promise<number> {
    this.logger.log('Obteniendo siguiente ID de producto');
    try {
      const maxProducto = await this.productoRepository
        .createQueryBuilder('producto')
        .select('MAX(producto.id)', 'max')
        .getRawOne();

      const nextId = (maxProducto?.max || 0) + 1;
      this.logger.log(`Siguiente ID de producto será: ${nextId}`);
      return nextId;
    } catch (error) {
      this.logger.error(`Error obteniendo siguiente ID: ${error.message}`);
      throw error;
    }
  }

  async removeImageFromProduct(
    productId: number,
    imageId: number,
  ): Promise<Producto> {
    this.logger.log(
      `Iniciando eliminación de imagen ${imageId} del producto ${productId}`,
    );
    const producto = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['imagenes'],
    });

    if (!producto) {
      this.logger.warn(`Producto ${productId} no encontrado`);
      throw new NotFoundException('Producto no encontrado');
    }
    const imagenExistente = producto.imagenes.find((img) => img.id === imageId);

    if (!imagenExistente) {
      this.logger.warn(
        `Imagen ${imageId} no encontrada para el producto ${productId}`,
      );
      throw new NotFoundException('Imagen no encontrada');
    }
    const imagePath = path.join(
      __dirname,
      '..',
      'public',
      imagenExistente.urlImagen,
    );
    try {
      await fsPromises.unlink(imagePath);
      this.logger.log(`Archivo de imagen eliminado exitosamente: ${imagePath}`);
    } catch (err) {
      this.logger.error(`Error al eliminar archivo de imagen: ${err.message}`);
      throw new Error('Error al eliminar la imagen del sistema de archivos');
    }
    await this.imagenProductoRepository.remove(imagenExistente);
    producto.imagenes = producto.imagenes.filter((img) => img.id !== imageId);
    this.logger.log(
      `Imagen ${imageId} eliminada exitosamente del producto ${productId}`,
    );
    return this.productoRepository.save(producto);
  }

  async uploadProductImage(
    productId: number,
    file: Express.Multer.File,
  ): Promise<Producto> {
    this.logger.log(`Iniciando carga de imagen para producto ${productId}`);
    if (!file) {
      this.logger.warn('No se ha recibido archivo para cargar');
      throw new BadRequestException('No se ha recibido el archivo.');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      this.logger.warn(`Tipo de archivo no válido: ${file.mimetype}`);
      throw new BadRequestException('El archivo no es una imagen válida.');
    }

    const producto = await this.productoRepository.findOne({
      where: { id: Number(productId) },
      relations: ['imagenes'],
    });
    if (!producto) {
      this.logger.warn(`Producto ${productId} no encontrado`);
      throw new NotFoundException('Producto no encontrado.');
    }

    const staticDir = path.join('uploads');
    if (!fs.existsSync(staticDir)) {
      this.logger.log(`Creando directorio de uploads: ${staticDir}`);
      fs.mkdirSync(staticDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const newFilePath = path.join(staticDir, fileName);
    fs.renameSync(file.path, newFilePath);

    const urlImagen = `/uploads/${fileName}`;
    const nuevaImagen = this.imagenProductoRepository.create({
      producto,
      urlImagen,
    });
    await this.imagenProductoRepository.save(nuevaImagen);
    this.logger.log(`Imagen cargada exitosamente para producto ${productId}`);

    return await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['imagenes'],
    });
  }

  async habilitarProducto(id: number, activo: number): Promise<Producto> {
    this.logger.log(`Intentando habilitar producto ${id}`);
    if (!id || id <= 0) {
      throw new BadRequestException('ID de producto inválido');
    }

    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }

    if (producto.activo === activo) {
      throw new BadRequestException('El producto ya está habilitado');
    }

    producto.activo = activo;
    this.logger.log(`Producto ${id} habilitado exitosamente`);
    return this.productoRepository.save(producto);
  }

  async deshabilitarProducto(id: number, activo: number): Promise<Producto> {
    this.logger.log(`Intentando deshabilitar producto ${id}`);
    if (!id || id <= 0) {
      throw new BadRequestException('ID de producto inválido');
    }

    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }

    if (producto.activo === activo) {
      throw new BadRequestException('El producto ya está deshabilitado');
    }

    producto.activo = activo;
    this.logger.log(`Producto ${id} deshabilitado exitosamente`);
    return this.productoRepository.save(producto);
  }

  async validaStock(id: number, stockCompra: number): Promise<number> {
    this.logger.log(
      `Validando stock para producto ${id}, cantidad solicitada: ${stockCompra}`,
    );
    try {
      const producto = await this.productoRepository.findOneBy({ id });
      if (!producto) {
        this.logger.warn(`Producto ${id} no encontrado`);
        throw new NotFoundException(`Producto ${id} no encontrado`);
      }

      if (stockCompra > producto.stock) {
        this.logger.warn(
          `Stock insuficiente para producto ${id}. Disponible: ${producto.stock}, Solicitado: ${stockCompra}`,
        );
        return null;
      }

      this.logger.log(`Stock validado exitosamente para producto ${id}`);
      return stockCompra;
    } catch (error) {
      this.logger.error(`Error validando stock: ${error.message}`);
      throw error;
    }
  }
}
