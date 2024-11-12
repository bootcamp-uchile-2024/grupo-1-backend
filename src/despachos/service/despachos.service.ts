import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerDespachos } from '../dto/ver-despachos-dto';
import { EstadosDespacho } from '../entities/estados_despacho.entity';
import { Despacho } from '../entities/despacho.entity';

@Injectable()
export class DespachosService {
  constructor(
    @InjectRepository(Despacho)
    private readonly despachoRepository: Repository<Despacho>,
    @InjectRepository(EstadosDespacho)
    private readonly estadosDespachoRepository: Repository<EstadosDespacho>,
  ) {}
}
