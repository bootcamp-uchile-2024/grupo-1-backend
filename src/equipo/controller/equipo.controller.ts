import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EquipoService } from '../service/equipo.service';
import { Equipo } from '../entities/equipo.entity';
@ApiTags('equipos')
@Controller('equipos')
export class EquipoController {
  constructor(private readonly equipoService: EquipoService) {}
  @Get('/informacion')
  getEquipo() {
    return this.equipoService.getEquipo();
  }
  @Get('informacion/areas')
  getAreas(@Query('nombreArea') nombreArea?: string): Equipo[] {
    return this.equipoService.getAreas(nombreArea ? nombreArea : undefined);
  }
  @Get('informacion/ecommerce')
  getEcommerce(): object {
    return this.equipoService.getEcommerce();
  }
}
