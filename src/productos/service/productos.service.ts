import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
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
    return await this.productoRepository.save(producto);
  }

  async editImageForProduct(
    productId: number,
    imageId: number,
    imageBase64: string,
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
  ): Promise<{ data: Producto[]; total: number }> {
    return gestionPaginacion(this.productoRepository, page, size, [
      'categoria',
      'imagenes',
    ]);
  }

  // CATALOGO de productos
  // busca todos los productos
  async findallcatalogo(): Promise<Producto[]> {
    const productos = await this.productoRepository.find({
      relations: ['categoria', 'imagenes'],
    });
    return productos;
  }

  // busca un producto por su id
  async porProducto(id: number): Promise<Producto[]> {
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

    return producto;
  }

  async findOneOC(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      return null;
    }
    return producto;
  }

  async findallcatalogo222(categoriaNombre?: string): Promise<Producto[]> {
    let productos: Producto[];

    if (categoriaNombre) {
      const categoria = await this.categoriaRepository.findOne({
        where: { nombreCategoria: categoriaNombre },
      });

      if (!categoria) {
        throw new NotFoundException(
          `Categoría con nombre ${categoriaNombre} no encontrada`,
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

    return productos;
  }
  async findProductosByCategoriaId(idCategoria: number): Promise<Producto[]> {
    const productos = await this.productoRepository.find({
      where: { categoria: { id: idCategoria } },
      relations: ['categoria', 'imagenes'],
    });

    if (!productos.length) {
      throw new NotFoundException(
        `No se encontraron productos para la categoría con ID ${idCategoria}`,
      );
    }

    return productos;
  }
  async deleteProducto(id: number): Promise<void> {
    const result = await this.productoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
  }
  async updateProducto(
    id: number,
    updateProductoDto: CreateProductoDto,
  ): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    Object.assign(producto, updateProductoDto);
    return await this.productoRepository.save(producto);
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
      console.error(
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
      return productoGuardado;
    } catch (error) {
      console.error('Error durante la creación del producto:', error); // Agrega esta línea
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
    const maxProducto = await this.productoRepository
      .createQueryBuilder('producto')
      .select('MAX(producto.id)', 'max')
      .getRawOne();

    return (maxProducto?.max || 0) + 1;
  }

  async removeImageFromProduct(
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
    const imagenExistente = producto.imagenes.find((img) => img.id === imageId);

    if (!imagenExistente) {
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
    } catch (err) {
      console.error('Error al eliminar la imagen:', err);
      throw new Error('Error al eliminar la imagen del sistema de archivos');
    }
    await this.imagenProductoRepository.remove(imagenExistente);
    producto.imagenes = producto.imagenes.filter((img) => img.id !== imageId);
    return this.productoRepository.save(producto);
  }

  async uploadProductImage(
    productId: number,
    file: Express.Multer.File,
  ): Promise<Producto> {
    if (!file) {
      throw new BadRequestException('No se ha recibido el archivo.');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('El archivo no es una imagen válida.');
    }

    const producto = await this.productoRepository.findOne({
      where: { id: Number(productId) },
      relations: ['imagenes'],
    });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado.');
    }
    const staticDir = path.join('uploads');

    if (!fs.existsSync(staticDir)) {
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

    return await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['imagenes'],
    });
  }

  async habilitarProducto(id: number, activo: number): Promise<Producto> {
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
    return this.productoRepository.save(producto);
  }

  async deshabilitarProducto(id: number, activo: number): Promise<Producto> {
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
    return this.productoRepository.save(producto);
  }

  async validaStock(id: number, stockCompra: number): Promise<number> {
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrada`);
    }
    if (stockCompra > producto.stock) {
      return null;
    }
    return stockCompra;
  }
}
