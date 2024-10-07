import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';
import { OrdenComprasService } from '../service/orden-compras.service';
import { CreateOrdenCompraDto } from '../dto/create-orden-compra.dto';
import { ValidaOrdenPipePipe } from 'src/comunes/pipes/valida-orden.pipe.pipe';
@ApiTags('ventas')
@Controller('ventas')
@UsePipes(new ValidationPipe({ transform: true }))
export class VentasController {
  constructor(private readonly ordenComprasService: OrdenComprasService) {}
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: 'Historia Usuario H005: Crea orden de compra con su detalle',
    description:
      'Esta funcionalidad permite apartir de un conjunto de productos crear orden de compra asignandole automaticamente el numero de compra y guardan el detalle de los productos seleccionados',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden de Compra Creada desde carrito compras',
  })
  @ApiResponse({ status: 400, description: 'Orden no Creada' })
  @ApiBody({ type: CreateOrdenCompraDto })
  @Post()
  @UsePipes(ValidaOrdenPipePipe)
  create(
    @Body() CreateOrdenCompraDto: CreateOrdenCompraDto,
    @Res() res: Response,
  ) {
    try {
      const resultado = this.ordenComprasService.create(CreateOrdenCompraDto);
      res.status(200).send(resultado);
    } catch (error) {
      res.status(error.statusCode).send({ message: error.message });
    }
  }
  @Get()
  findAll() {
    return this.ordenComprasService.findAll();
  }
}
