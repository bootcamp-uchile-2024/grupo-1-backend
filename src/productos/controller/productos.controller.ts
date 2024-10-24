import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Query,
  UsePipes,
  ValidationPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CodigoProductoPipe } from 'src/comunes/pipes/codigo-producto.pipe';
import { Producto } from 'entitipt/producto.entity';
import { ProductosService } from '../service/productos.service';

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get('catalogo')
  @ApiOperation({
    summary: 'Historia Usuario H004: Listado de Productos Plantopia',
    description:
      'Lista todos los productos del catalogo de plantopia sin filtros',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de todos los productos',
    type: [Producto],
  })
  async findAllCatalogo() {
    return await this.productosService.findallcatalogo();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un producto por ID',
    description: 'Devuelve los detalles de un producto espec�fico por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del producto encontrado',
    type: Producto,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const producto = await this.productosService.porProducto(+id);

    if (!producto) {
      return res.status(404).send({ message: 'Producto no encontrado' });
    }
    res.status(200).send(producto);
  }
}
