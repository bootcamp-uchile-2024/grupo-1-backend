import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Planta } from 'src/productos/entities/planta.entity';
import { Repository } from 'typeorm';
import { DificultadDeCuidado } from 'src/productos/entities/dificultad_de_cuidado.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Injectable()
export class FiltrosService {
  constructor(
    @InjectRepository(Planta)
    private readonly plantaRepository: Repository<Planta>,
    @InjectRepository(DificultadDeCuidado)
    private readonly dificultadRepository: Repository<DificultadDeCuidado>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async filtroPetFriendly(filtro: number): Promise<Planta[]> {
    try {
      const filtroPlantas: Planta[] = await this.plantaRepository.find({
        where: { toxicidadMascotas: filtro },
      });
      return filtroPlantas;
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error al obtener las plantas',
        data: error,
      });
    }
  }

  async filtroCuidados(filtro: string): Promise<Planta[]> {
    try {
      const filtrocuidados = await this.dificultadRepository.findOne({
        where: { descripcion: filtro },
      });
      const filtroPlantas: Planta[] = await this.plantaRepository.find({
        where: { dificultad: filtrocuidados },
      });
      return filtroPlantas;
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error al obtener las plantas',
        data: error,
      });
    }
  }
  async filtroMasValorados(categoria: string): Promise<Planta[]> {
    try {
      const plantas = await this.plantaRepository
        .createQueryBuilder('planta')
        .leftJoinAndSelect('planta.producto', 'producto')
        .leftJoinAndSelect('producto.categoria', 'categoria')
        .where('categoria.nombreCategoria = :categoria', { categoria })
        .andWhere('producto.valoracion IS NOT NULL')
        .orderBy('producto.valoracion', 'DESC')
        .getMany();

      return plantas;
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error al obtener las plantas más valoradas',
        data: error,
      });
    }
  }
}
