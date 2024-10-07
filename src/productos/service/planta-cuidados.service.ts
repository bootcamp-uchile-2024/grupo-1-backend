import { Injectable } from '@nestjs/common';
import { CreatePlantaCuidadoDto } from '../dto/create-planta-cuidado.dto';
@Injectable()
export class PlantaCuidadosService {
  create(createPlantaCuidadoDto: CreatePlantaCuidadoDto) {
    return 'This action adds a new plantaCuidado';
  }

  findAll() {
    return `This action returns all plantaCuidados`;
  }
}
