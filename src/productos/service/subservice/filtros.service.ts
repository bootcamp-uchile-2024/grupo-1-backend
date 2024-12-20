import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Planta } from 'src/productos/entities/planta.entity';
import { Repository } from 'typeorm';
import { DificultadDeCuidado } from 'src/productos/entities/dificultad_de_cuidado.entity';

@Injectable()
export class FiltrosService {
  constructor(
    @InjectRepository(Planta)
    private readonly plantaRepository: Repository<Planta>,
    @InjectRepository(DificultadDeCuidado)
    private readonly dificultadRepository: Repository<DificultadDeCuidado>,
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
}
