import {
  Injectable,
  BadRequestException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Planta } from 'src/productos/entities/planta.entity';
import { Repository } from 'typeorm';
import { DificultadDeCuidado } from 'src/productos/entities/dificultad_de_cuidado.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Injectable()
export class FiltrosService {
  private readonly logger = new Logger(FiltrosService.name);

  constructor(
    @InjectRepository(Planta)
    private readonly plantaRepository: Repository<Planta>,
    @InjectRepository(DificultadDeCuidado)
    private readonly dificultadRepository: Repository<DificultadDeCuidado>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async filtroPetFriendly(filtro: number): Promise<Planta[]> {
    this.logger.log(
      `Iniciando búsqueda de plantas pet friendly con filtro: ${filtro}`,
    );
    try {
      const filtroPlantas: Planta[] = await this.plantaRepository.find({
        where: { toxicidadMascotas: filtro },
      });
      this.logger.log(
        `Se encontraron ${filtroPlantas.length} plantas pet friendly`,
      );
      return filtroPlantas;
    } catch (error) {
      this.logger.error(`Error en filtroPetFriendly: ${error.message}`);
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error al obtener las plantas',
        data: error,
      });
    }
  }

  async filtroCuidados(filtro: string): Promise<Planta[]> {
    this.logger.log(
      `Iniciando búsqueda de plantas por nivel de cuidado: ${filtro}`,
    );
    try {
      const filtrocuidados = await this.dificultadRepository.findOne({
        where: { descripcion: filtro },
      });
      this.logger.log(
        `Dificultad encontrada: ${filtrocuidados?.descripcion || 'No encontrada'}`,
      );

      const filtroPlantas: Planta[] = await this.plantaRepository.find({
        where: { dificultad: filtrocuidados },
      });
      this.logger.log(
        `Se encontraron ${filtroPlantas.length} plantas con el nivel de cuidado especificado`,
      );
      return filtroPlantas;
    } catch (error) {
      this.logger.error(`Error en filtroCuidados: ${error.message}`);
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error al obtener las plantas',
        data: error,
      });
    }
  }
  async filtroMasValorados(categoria: string): Promise<Planta[]> {
    this.logger.log(
      `Iniciando búsqueda de plantas más valoradas para la categoría: ${categoria}`,
    );
    try {
      const plantas = await this.plantaRepository
        .createQueryBuilder('planta')
        .leftJoinAndSelect('planta.producto', 'producto')
        .leftJoinAndSelect('producto.categoria', 'categoria')
        .where('categoria.nombreCategoria = :categoria', { categoria })
        .andWhere('producto.valoracion IS NOT NULL')
        .orderBy('producto.valoracion', 'DESC')
        .getMany();

      this.logger.log(
        `Se encontraron ${plantas.length} plantas más valoradas en la categoría ${categoria}`,
      );
      return plantas;
    } catch (error) {
      this.logger.error(`Error en filtroMasValorados: ${error.message}`);
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error al obtener las plantas más valoradas',
        data: error,
      });
    }
  }
  async obtenerPlantasMasVendidas(): Promise<Planta[]> {
    this.logger.log('Iniciando búsqueda de plantas más vendidas');

    try {
      const queryBuilder = this.plantaRepository.createQueryBuilder('planta');
      queryBuilder
        .innerJoinAndSelect('planta.producto', 'producto')
        .where('producto.activo = :activo', { activo: 1 });
      queryBuilder.leftJoinAndSelect('producto.categoria', 'categoria');
      queryBuilder.leftJoinAndSelect('producto.imagenes', 'imagenes');
      queryBuilder.orderBy('producto.cantidadVentas', 'DESC');
      queryBuilder.take(10);

      const plantasMasVendidas = await queryBuilder.getMany();

      this.logger.log(
        `Se encontraron ${plantasMasVendidas.length} plantas más vendidas`,
      );

      return plantasMasVendidas;
    } catch (error) {
      this.logger.error(
        `Error al obtener plantas más vendidas: ${error.message}`,
      );
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error al obtener las plantas más vendidas',
        data: error,
      });
    }
  }
}
