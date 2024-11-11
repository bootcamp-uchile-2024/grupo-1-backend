import {
  HttpException,
  HttpStatus,
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
  ) {}
  // METODOS DE CATEGORIA
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
  async findAllCatalogoPaginado(
    page: number,
    size: number,
  ): Promise<{ data: Producto[]; total: number }> {
    const [result, total] = await this.productoRepository.findAndCount({
      relations: ['categoria', 'imagenes'],
      skip: (page - 1) * size,
      take: size,
    });

    return {
      data: result,
      total,
    };
  }
  async findAllCategorias(): Promise<Categoria[]> {
    return await this.categoriaRepository.find();
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

    const createProductoDto: CreateProductoDto = {
      ...productoData,
      nombreProducto: nombrePlanta,
      descripcionProducto: `Planta: ${nombrePlanta}`,
      idCategoria: 1, // Asigna la categoría de planta (ID número 1)
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
    const [result, total] = await this.plantaRepository.findAndCount({
      relations: ['producto', 'producto.categoria', 'producto.imagenes'],
      skip: (page - 1) * size,
      take: size,
    });

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
    const createProductoDto: CreateProductoDto = {
      ...createMaceteroDto,
      idCategoria: 3, // Asigna la categoría de macetero (ID número 3)
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
    const [result, total] = await this.maceteroRepository.findAndCount({
      relations: ['producto', 'producto.categoria', 'producto.imagenes'],
      skip: (page - 1) * size,
      take: size,
    });

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
    const [result, total] = await this.fertilizanteRepository.findAndCount({
      relations: ['producto', 'producto.categoria', 'producto.imagenes'],
      skip: (page - 1) * size,
      take: size,
    });

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
}
