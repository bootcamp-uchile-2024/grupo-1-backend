import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Producto } from 'src/productos/entities/producto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DeepPartial } from 'typeorm';
import { Planta } from 'src/productos/entities/planta.entity';
import { Habitat } from 'src/productos/entities/habitat.entity';
import { LuzRequerida } from 'src/productos/entities/luz_requerida.entity';
import { CreateProductoDto } from 'src/productos/dto/create-producto.dto';
import { CreatePlantaDto } from 'src/productos/dto/create-planta.dto';
import { ImagenProducto } from 'src/productos/entities/imagen_producto.entity';
import { Categoria } from 'src/productos/entities/categoria.entity';
import { DificultadDeCuidado } from 'src/productos/entities/dificultad_de_cuidado.entity';
import { Estacion } from 'src/productos/entities/estacion.entity';
import { Fertilizante } from 'src/productos/entities/fertilizante.entity';
import { FrecuenciaDeRiego } from 'src/productos/entities/frecuencia_de_riego.entity';
import { NivelDeHumedad } from 'src/productos/entities/nivel_de_humedad.entity';
import { Sustrato } from 'src/productos/entities/sustrato.entity';
import { TipoDeSuelo } from 'src/productos/entities/tipo_de_suelo.entity';
import { UpdatePlantaDto } from 'src/productos/dto/update-planta.dto';
import { NewCreatePlantaDto } from 'src/productos/dto/new-create-planta.dto';

@Injectable()
export class PlantaService {
  private readonly logger = new Logger(PlantaService.name);
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
  ) {}

  async createPlanta(createPlantaDto: CreatePlantaDto): Promise<Planta> {
    const timestamp = new Date().toISOString();
    this.logger.log(
      `${timestamp} INFO [PlantaService] Iniciando creación de planta`,
    );

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

    this.logger.log(
      `${timestamp} INFO [PlantaService] Buscando categoría de plantas`,
    );
    const categoriaPlanta = await this.categoriaRepository.findOne({
      where: { nombreCategoria: 'Plantas' },
    });

    if (!categoriaPlanta) {
      this.logger.warn(
        `${timestamp} WARN [PlantaService] Categoría de plantas no encontrada`,
      );
      throw new NotFoundException('Categoría de plantas no encontrada');
    }

    const createProductoDto: CreateProductoDto = {
      ...productoData,
      nombreProducto: nombrePlanta,
      descripcionProducto: `Planta: ${nombrePlanta}`,
      idCategoria: categoriaPlanta.id, // Asigna la categoría de planta (ID número 1)
      imagenProducto,
    };

    this.logger.log(`${timestamp} INFO [PlantaService] Guardando producto`);
    const producto = await this.productoRepository.save(createProductoDto);

    this.logger.log(
      `${timestamp} INFO [PlantaService] Buscando hábitat con ID ${habitat}`,
    );
    const habitatEntity = await this.habitatRepository.findOneBy({
      id: habitat,
    });
    if (!habitatEntity) {
      this.logger.warn(
        `${timestamp} WARN [PlantaService] Hábitat con ID ${habitat} no encontrado`,
      );
      throw new NotFoundException(`Hábitat con ID ${habitat} no encontrado`);
    }

    this.logger.log(
      `${timestamp} INFO [PlantaService] Buscando luz requerida con ID ${luz}`,
    );
    const luzEntity = await this.luzRepository.findOneBy({ id: luz });
    if (!luzEntity) {
      this.logger.warn(
        `${timestamp} WARN [PlantaService] Luz requerida con ID ${luz} no encontrada`,
      );
      throw new NotFoundException(`Luz requerida con ID ${luz} no encontrada`);
    }

    this.logger.log(
      `${timestamp} INFO [PlantaService] Buscando nivel de humedad con ID ${humedadIdeal}`,
    );
    const humedadEntity = await this.humedadRepository.findOneBy({
      id: humedadIdeal,
    });
    if (!humedadEntity) {
      this.logger.warn(
        `${timestamp} WARN [PlantaService] Nivel de humedad con ID ${humedadIdeal} no encontrado`,
      );
      throw new NotFoundException(
        `Nivel de humedad con ID ${humedadIdeal} no encontrado`,
      );
    }

    this.logger.log(
      `${timestamp} INFO [PlantaService] Buscando dificultad de cuidado con ID ${dificultadDeCuidado}`,
    );
    const dificultadEntity = await this.dificultadRepository.findOneBy({
      id: dificultadDeCuidado,
    });
    if (!dificultadEntity) {
      this.logger.warn(
        `${timestamp} WARN [PlantaService] Dificultad de cuidado con ID ${dificultadDeCuidado} no encontrada`,
      );
      throw new NotFoundException(
        `Dificultad de cuidado con ID ${dificultadDeCuidado} no encontrada`,
      );
    }

    this.logger.log(
      `${timestamp} INFO [PlantaService] Buscando frecuencia de riego con ID ${frecuenciaDeRiego}`,
    );
    const frecuenciaEntity = await this.frecuenciaRepository.findOneBy({
      id: frecuenciaDeRiego,
    });
    if (!frecuenciaEntity) {
      this.logger.warn(
        `${timestamp} WARN [PlantaService] Frecuencia de riego con ID ${frecuenciaDeRiego} no encontrada`,
      );
      throw new NotFoundException(
        `Frecuencia de riego con ID ${frecuenciaDeRiego} no encontrada`,
      );
    }

    this.logger.log(`${timestamp} INFO [PlantaService] Creando nueva planta`);
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
      this.logger.log(
        `${timestamp} INFO [PlantaService] Buscando fertilizantes sugeridos`,
      );
      nuevaPlanta.fertilizantes = await this.fertilizanteRepository.findBy({
        id: In(fertilizantesSugeridos),
      });
    }

    if (sustratosSugeridos) {
      this.logger.log(
        `${timestamp} INFO [PlantaService] Buscando sustratos sugeridos`,
      );
      nuevaPlanta.sustratos = await this.sustratoRepository.findBy({
        id: In(sustratosSugeridos),
      });
    }

    if (estacion) {
      this.logger.log(`${timestamp} INFO [PlantaService] Buscando estaciones`);
      nuevaPlanta.estaciones = await this.estacionRepository.findBy({
        id: In(estacion),
      });
    }

    if (tipoSuelo) {
      this.logger.log(
        `${timestamp} INFO [PlantaService] Buscando tipos de suelo`,
      );
      nuevaPlanta.suelos = await this.sueloRepository.findBy({
        id: In(tipoSuelo),
      });
    }

    this.logger.log(`${timestamp} INFO [PlantaService] Guardando nueva planta`);
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
  async findPlantaById(idProducto: number): Promise<Planta> {
    this.logger.log({
      message: `Buscando planta con producto ID ${idProducto}`,
      context: PlantaService.name,
    });

    try {
      const planta = await this.plantaRepository.findOne({
        where: {
          producto: {
            id: idProducto,
          },
        },
        relations: ['producto', 'producto.categoria', 'producto.imagenes'],
      });

      if (!planta) {
        this.logger.warn({
          message: `Planta con ID de producto ${idProducto} no encontrada`,
          context: PlantaService.name,
        });
        throw new NotFoundException(
          `Planta con ID de producto ${idProducto} no encontrada`,
        );
      }

      this.logger.log({
        message: `Planta encontrada: ${JSON.stringify(planta)}`,
        context: PlantaService.name,
      });

      return planta;
    } catch (error) {
      this.logger.error({
        message: `Error al buscar planta con producto ID ${idProducto}`,
        context: PlantaService.name,
        stack: error.stack,
      });

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Error inesperado al buscar planta.`,
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePlanta(
    id: number,
    updatePlantaDto: UpdatePlantaDto,
  ): Promise<Planta> {
    this.logger.log({
      message: `Buscando planta con ID: ${id}`,
      context: PlantaService.name,
    });

    const planta = await this.plantaRepository.findOneBy({ id });
    if (!planta) {
      this.logger.warn({
        message: `Planta con ID ${id} no encontrada`,
        context: PlantaService.name,
      });
      throw new NotFoundException(`Planta con ID ${id} no encontrada`);
    }

    this.logger.log({
      message: `Buscando producto asociado con ID: ${planta.producto.id}`,
      context: PlantaService.name,
    });

    const producto = await this.productoRepository.findOneBy({
      id: planta.producto.id,
    });
    if (!producto) {
      this.logger.warn({
        message: `Producto asociado con ID ${planta.producto.id} no encontrado`,
        context: PlantaService.name,
      });
      throw new NotFoundException(
        `Producto asociado con ID ${planta.producto.id} no encontrado`,
      );
    }

    this.logger.log({
      message: `Actualizando producto asociado con ID: ${producto.id}`,
      context: PlantaService.name,
    });

    Object.assign(producto, updatePlantaDto);
    await this.productoRepository.save(producto);

    this.logger.log({
      message: `Actualizando planta con ID: ${id}`,
      context: PlantaService.name,
    });

    Object.assign(planta, updatePlantaDto);
    const updatedPlanta = await this.plantaRepository.save(planta);

    this.logger.log({
      message: `Planta con ID ${id} actualizada exitosamente`,
      context: PlantaService.name,
    });

    return updatedPlanta;
  }

  async deletePlanta(id: number): Promise<void> {
    this.logger.log({
      message: `Eliminando planta con ID: ${id}`,
      context: PlantaService.name,
    });

    const planta = await this.plantaRepository.findOne({ where: { id } });

    if (!planta) {
      this.logger.warn({
        message: `Planta con ID ${id} no encontrada`,
        context: PlantaService.name,
      });
      throw new NotFoundException(`Planta con ID ${id} no encontrada`);
    }

    try {
      await this.plantaRepository.delete(id);
      this.logger.log({
        message: `Planta con ID ${id} eliminada correctamente`,
        context: PlantaService.name,
      });
    } catch (error) {
      this.logger.error({
        message: `Error al eliminar planta con ID ${id}: ${error.message}`,
        stack: error.stack,
        context: PlantaService.name,
      });
      throw error;
    }
  }

  async newCreatePlanta(
    createPlantaDto: NewCreatePlantaDto,
    imagenes: string[],
  ): Promise<Planta> {
    const timestamp = new Date().toISOString();
    this.logger.log(
      `${timestamp} INFO [PlantaService] Iniciando creación de planta con imágenes`,
    );
    try {
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
        precio,
        precioNormal,
        stock,
        activo = 1,
      } = createPlantaDto;
      // Convertir strings a números
      const temperaturaIdealNum =
        this.extractNumberFromString(temperaturaIdeal);
      const tamanoMaximoNum = this.extractNumberFromString(tamanoMaximo);
      const pesoNum = this.extractNumberFromString(peso);
      // Buscar categoría de plantas
      this.logger.log(
        `${timestamp} INFO [PlantaService] Buscando categoría de plantas`,
      );
      const categoriaPlanta = await this.categoriaRepository.findOne({
        where: { nombreCategoria: 'Plantas' },
      });
      if (!categoriaPlanta) {
        throw new NotFoundException('Categoría de plantas no encontrada');
      }
      // Crear y guardar el producto con valores por defecto
      const productoData = {
        nombreProducto: nombrePlanta,
        descripcionProducto: `Planta: ${nombrePlanta}`,
        categoria: categoriaPlanta,
        precio,
        precioNormal,
        stock,
        activo,
        descuento: 0, // Valor por defecto
        valoracion: 0, // Valor por defecto
        cantidadVentas: 0, // Valor por defecto
      };
      const productoEntity = this.productoRepository.create(productoData);
      const productoGuardado =
        await this.productoRepository.save(productoEntity);
      // Crear y guardar las imágenes
      if (imagenes && imagenes.length > 0) {
        const imagenesData = imagenes.map((ruta) => ({
          urlImagen: ruta,
          producto: productoGuardado,
        }));
        const imagenesEntities =
          this.imagenProductoRepository.create(imagenesData);
        await this.imagenProductoRepository.save(imagenesEntities);
      }
      // Buscar entidades relacionadas
      const [
        habitatEntity,
        luzEntity,
        humedadEntity,
        dificultadEntity,
        frecuenciaEntity,
      ] = await Promise.all([
        this.habitatRepository.findOneBy({ id: habitat }),
        this.luzRepository.findOneBy({ id: luz }),
        this.humedadRepository.findOneBy({ id: humedadIdeal }),
        this.dificultadRepository.findOneBy({ id: dificultadDeCuidado }),
        this.frecuenciaRepository.findOneBy({ id: frecuenciaDeRiego }),
      ]);
      // Validar entidades
      if (!habitatEntity)
        throw new NotFoundException(`Hábitat con ID ${habitat} no encontrado`);
      if (!luzEntity)
        throw new NotFoundException(`Luz con ID ${luz} no encontrada`);
      if (!humedadEntity)
        throw new NotFoundException(
          `Humedad con ID ${humedadIdeal} no encontrada`,
        );
      if (!dificultadEntity)
        throw new NotFoundException(
          `Dificultad con ID ${dificultadDeCuidado} no encontrada`,
        );
      if (!frecuenciaEntity)
        throw new NotFoundException(
          `Frecuencia con ID ${frecuenciaDeRiego} no encontrada`,
        );
      // Crear la planta con tipos parciales
      const plantaData: DeepPartial<Planta> = {
        nombrePlanta,
        nombreCientifico,
        producto: productoGuardado,
        habitat: habitatEntity,
        luz: luzEntity,
        humedad: humedadEntity,
        temperaturaIdeal: temperaturaIdealNum,
        toxicidadMascotas,
        tamanoMaximo: tamanoMaximoNum,
        peso: pesoNum,
        dificultad: dificultadEntity,
        frecuencia: frecuenciaEntity,
        estaciones: [],
        fertilizantes: [],
        sustratos: [],
        suelos: [],
      };
      // Crear la entidad planta inicial
      let plantaEntity = this.plantaRepository.create(plantaData);
      // Buscar y asignar relaciones muchos a muchos
      if (estacion?.length) {
        const estacionesEncontradas = await this.estacionRepository.findBy({
          id: In(estacion),
        });
        if (estacionesEncontradas.length > 0) {
          plantaEntity.estaciones = estacionesEncontradas;
        }
      }
      if (fertilizantesSugeridos?.length) {
        const fertilizantesEncontrados =
          await this.fertilizanteRepository.findBy({
            id: In(fertilizantesSugeridos),
          });
        if (fertilizantesEncontrados.length > 0) {
          plantaEntity.fertilizantes = fertilizantesEncontrados;
        }
      }
      if (sustratosSugeridos?.length) {
        const sustratosEncontrados = await this.sustratoRepository.findBy({
          id: In(sustratosSugeridos),
        });
        if (sustratosEncontrados.length > 0) {
          plantaEntity.sustratos = sustratosEncontrados;
        }
      }
      if (tipoSuelo?.length) {
        const suelosEncontrados = await this.sueloRepository.findBy({
          id: In(tipoSuelo),
        });
        if (suelosEncontrados.length > 0) {
          plantaEntity.suelos = suelosEncontrados;
        }
      }
      // Guardar la planta
      this.logger.log(`${timestamp} INFO [PlantaService] Guardando planta`);
      const plantaGuardada = await this.plantaRepository.save(plantaEntity);
      // Recargar la planta con todas sus relaciones
      const plantaCompleta = await this.plantaRepository.findOne({
        where: { id: plantaGuardada.id },
        relations: [
          'producto',
          'habitat',
          'luz',
          'humedad',
          'dificultad',
          'frecuencia',
          'estaciones',
          'fertilizantes',
          'sustratos',
          'suelos',
        ],
      });
      if (!plantaCompleta) {
        throw new NotFoundException(
          `No se pudo encontrar la planta guardada con ID ${plantaGuardada.id}`,
        );
      }
      return plantaCompleta;
    } catch (error) {
      this.logger.error(`Error en newCreatePlanta: ${error.message}`);
      throw error;
    }
  }
  // Método auxiliar para extraer números de strings
  private extractNumberFromString(value: string): number {
    if (!value) return 0;
    // Extraer el primer número que encuentre en el string
    const match = value.match(/\d+(\.\d+)?/);
    if (match) {
      return parseFloat(match[0]);
    }
    // Si no encuentra números, retorna 0
    return 0;
  }
}
