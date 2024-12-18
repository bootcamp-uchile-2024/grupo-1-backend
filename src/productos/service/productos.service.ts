import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMaceteroDto } from '../dto/create-macetero.dto';
import { CreatePlantaDto } from '../dto/create-planta.dto';
import { Producto } from 'src/productos/entities/producto.entity';
import { CreateFertilizanteDto } from '../dto/create-fertilizante.dto';
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
import { UpdateFertilizanteDto } from '../dto/update-fertilizante.dto';
import { UpdateMaceteroDto } from '../dto/update-macetero.dto';
import { UpdatePlantaDto } from '../dto/update-planta.dto';
import { CreateSustratoDto } from '../dto/create-sustrato.dto';
import { UpdateSustratoDto } from '../dto/update-sustrato.dto';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
@Injectable()
export class ProductosService {
  productos: Producto[] = [];
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
  // METODOS DE CATEGORIA
  async createCategoria(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<Categoria> {
    const nuevaCategoria = this.categoriaRepository.create(createCategoriaDto);
    return await this.categoriaRepository.save(nuevaCategoria);
  }

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

    console.log('RUTA IMAGEN ', fullImagePath);

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
        console.log('Imagen eliminada del sistema de archivos:', imagePath);
      } catch (err) {
        console.error(
          'Error al eliminar la imagen del sistema de archivos:',
          err,
        );
      }
    }
    await this.imagenProductoRepository.remove(imagenExistente);
    producto.imagenes = producto.imagenes.filter((img) => img.id !== +imageId);
    return await this.productoRepository.save(producto);
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
  async findAllCatalogoPaginado(
    page: number,
    size: number,
  ): Promise<{ data: Producto[]; total: number }> {
    return this.gestionPaginacion(this.productoRepository, page, size, [
      'categoria',
      'imagenes',
    ]);
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
    console.log(
      'entro al servicio de categoria findCategoriaIdByName',
      nombreCategoria,
    );
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

  // CATALOGO de productos
  // busca todos los productos
  async findallcatalogo(): Promise<Producto[]> {
    console.log('entro al servicio catalogo de producto ');
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
    console.log('entro al servicio catalogo de producto ');

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

  async createPlanta(createPlantaDto: CreatePlantaDto): Promise<Planta> {
    const {
      nombrePlanta,
      nombreCientifico,
      habitat,
      luz,
      frecuenciaDeRiego,
      humedadIdeal,
      temperaturaIdeal,
      toxicidadMascotas,
      tamanoMaximo,
      peso,
      dificultadDeCuidado,
      estacion,
      fertilizantesSugeridos,
      sustratosSugeridos,
      tipoSuelo,
      imagenProducto,
      ...productoData
    } = createPlantaDto;

    const categoriaPlanta = await this.categoriaRepository.findOne({
      where: { nombreCategoria: 'Plantas' },
    });

    if (!categoriaPlanta) {
      throw new NotFoundException('Categoría de plantas no encontrada');
    }

    const createProductoDto: CreateProductoDto = {
      ...productoData,
      nombreProducto: nombrePlanta,
      descripcionProducto: `Planta: ${nombrePlanta}`,
      idCategoria: categoriaPlanta.id, // Asigna la categoría de planta (ID número 1)
      imagenProducto,
    };

    const producto = await this.createProducto(createProductoDto);

    const habitatEntity = await this.habitatRepository.findOneBy({
      id: habitat,
    });
    if (!habitatEntity) {
      throw new NotFoundException(`Hábitat con ID ${habitat} no encontrado`);
    }

    const luzEntity = await this.luzRepository.findOneBy({ id: luz });
    if (!luzEntity) {
      throw new NotFoundException(`Luz requerida con ID ${luz} no encontrada`);
    }

    const humedadEntity = await this.humedadRepository.findOneBy({
      id: humedadIdeal,
    });
    if (!humedadEntity) {
      throw new NotFoundException(
        `Nivel de humedad con ID ${humedadIdeal} no encontrado`,
      );
    }

    const dificultadEntity = await this.dificultadRepository.findOneBy({
      id: dificultadDeCuidado,
    });
    if (!dificultadEntity) {
      throw new NotFoundException(
        `Dificultad de cuidado con ID ${dificultadDeCuidado} no encontrada`,
      );
    }

    const frecuenciaEntity = await this.frecuenciaRepository.findOneBy({
      id: frecuenciaDeRiego,
    });
    if (!frecuenciaEntity) {
      throw new NotFoundException(
        `Frecuencia de riego con ID ${frecuenciaDeRiego} no encontrada`,
      );
    }

    const nuevaPlanta = this.plantaRepository.create({
      nombrePlanta,
      nombreCientifico,
      producto,
      habitat: habitatEntity,
      luz: luzEntity,
      humedad: humedadEntity,
      temperaturaIdeal,
      toxicidadMascotas,
      tamanoMaximo,
      peso,
      dificultad: dificultadEntity,
      frecuencia: frecuenciaEntity,
    });

    if (fertilizantesSugeridos) {
      nuevaPlanta.fertilizantes = await this.fertilizanteRepository.findByIds(
        fertilizantesSugeridos,
      );
    }

    if (sustratosSugeridos) {
      nuevaPlanta.sustratos =
        await this.sustratoRepository.findByIds(sustratosSugeridos);
    }

    if (estacion) {
      nuevaPlanta.estaciones =
        await this.estacionRepository.findByIds(estacion);
    }

    if (tipoSuelo) {
      nuevaPlanta.suelos = await this.sueloRepository.findByIds(tipoSuelo);
    }

    return await this.plantaRepository.save(nuevaPlanta);
  }
  async getPlantasPaginadas(
    page: number,
    size: number,
  ): Promise<{ data: Planta[]; total: number }> {
    const queryBuilder = this.plantaRepository.createQueryBuilder('planta');

    // Añadir condición para filtrar por 'activo = 1' en la entidad Producto
    queryBuilder
      .innerJoinAndSelect('planta.producto', 'producto')
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

  async findPlantaById(id: number): Promise<Planta> {
    const planta = await this.plantaRepository.findOne({
      where: { id },
      relations: ['producto', 'producto.categoria', 'producto.imagenes'],
    });

    if (!planta) {
      throw new NotFoundException(`Planta con ID ${id} no encontrada`);
    }

    return planta;
  }
  async updatePlanta(
    id: number,
    updatePlantaDto: UpdatePlantaDto,
  ): Promise<Planta> {
    const planta = await this.plantaRepository.findOneBy({ id });
    if (!planta) {
      throw new NotFoundException(`Planta con ID ${id} no encontrada`);
    }

    const producto = await this.productoRepository.findOneBy({
      id: planta.producto.id,
    });
    if (!producto) {
      throw new NotFoundException(
        `Producto asociado con ID ${planta.producto.id} no encontrado`,
      );
    }

    // Actualizar el producto asociado
    Object.assign(producto, updatePlantaDto);
    await this.productoRepository.save(producto);

    // Actualizar la planta
    Object.assign(planta, updatePlantaDto);
    return await this.plantaRepository.save(planta);
  }
  async deletePlanta(id: number): Promise<void> {
    const result = await this.plantaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Planta con ID ${id} no encontrada`);
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

    const producto = await this.createProducto(createProductoDto);

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

  async findMaceteroById(id: number): Promise<Macetero> {
    const macetero = await this.maceteroRepository.findOne({
      where: { id },
      relations: ['producto', 'producto.categoria', 'producto.imagenes'],
    });

    if (!macetero) {
      throw new NotFoundException(`Macetero con ID ${id} no encontrado`);
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

    // Actualizar el producto asociado
    Object.assign(producto, updateMaceteroDto);
    await this.productoRepository.save(producto);

    // Actualizar el macetero
    Object.assign(macetero, updateMaceteroDto);
    return await this.maceteroRepository.save(macetero);
  }

  async deleteMacetero(id: number): Promise<void> {
    const result = await this.maceteroRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Macetero con ID ${id} no encontrado`);
    }
  }
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

  async findSustratoById(id: number): Promise<Sustrato> {
    const sustrato = await this.sustratoRepository.findOne({
      where: { id },
      relations: ['producto', 'producto.categoria', 'producto.imagenes'],
    });
    if (!sustrato) {
      throw new NotFoundException(`Sustrato con ID ${id} no encontrado`);
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
  //METODO UNICO PARA EL CONTROL DE PAGINACION
  async gestionPaginacion<T>(
    repository: Repository<T>,
    page: number,
    size: number,
    relations: string[] = [],
  ): Promise<{ data: T[]; total: number }> {
    const queryBuilder = repository.createQueryBuilder('producto');

    // Añadir la condición donde 'activo' sea 1
    queryBuilder.where('producto.activo = :activo', { activo: 1 });

    // Añadir relaciones si las tienes
    relations.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(`producto.${relation}`, relation);
    });

    // Paginación
    queryBuilder.skip((page - 1) * size);
    queryBuilder.take(size);

    const [result, total] = await queryBuilder.getManyAndCount();

    return {
      data: result,
      total,
    };
  }

  async removeImageFromProduct(
    productId: number,
    imageId: number, // Añadimos el parámetro imageId
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
      await fsPromises.unlink(imagePath); // Eliminar archivo
    } catch (err) {
      console.error('Error al eliminar la imagen:', err);
      throw new Error('Error al eliminar la imagen del sistema de archivos');
    }
    await this.imagenProductoRepository.remove(imagenExistente);
    producto.imagenes = producto.imagenes.filter((img) => img.id !== imageId);
    return this.productoRepository.save(producto);
  }

  /**
   * Carga una imagen y la asocia al producto en la base de datos.
   * @param productId ID del producto al cual se asocia la imagen.
   * @param file Archivo de imagen subido.
   * @returns Producto con la nueva imagen asociada.
   */
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

  async habilitarProducto(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }
    producto.activo = 1;
    return this.productoRepository.save(producto);
  }

  async deshabilitarProducto(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }
    producto.activo = 0;
    return this.productoRepository.save(producto);
  }
}
