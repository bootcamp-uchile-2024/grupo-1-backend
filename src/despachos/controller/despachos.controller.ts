import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { DespachosService } from '../service/despachos.service';

@ApiTags('Despachos')
@Controller('despachos')
export class DespachosController {
  constructor(private readonly despachosService: DespachosService) {}
  @Get(':id/seguimiento')
  @ApiOperation({
    summary: 'Historia Usuario H0006: Obtiene orden de compra por ID',
    description:
      'Obtiene el detalle de la orden de compra por id donde devuelve el estado, fecha, seguimiento y proveedor seguimiento',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna Despacho',
  })
  findOne(@Param('id') id: string, @Res() @Res() res: Response) {
    res.status(501).send('No implementado');
  }
}
