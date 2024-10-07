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
import { CreateMaceteroDto } from '../dto/create-macetero.dto';
import { CodigoProductoPipe } from 'src/comunes/pipes/codigo-producto.pipe';
import { ProductosService } from '../service/productos.service';
import { TipoProductos } from '../enum/tipo-productos';
import { CreatePlantaDto } from '../dto/create-planta.dto';
import { CreateControlPlagasDto } from '../dto/create-control-plagas.dto';
import { CreateFertilizanteDto } from '../dto/create-fertilizante.dto';
import { CreateSustratoDto } from '../dto/create-sustrato.dto';
@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}
  @Get('masvendidos')
  @ApiOperation({
    summary: 'Historia Usuario H001: Productos mas vendidos',
    description:
      'Permite listar los productos que tienen ventas y en donde el total de venta de cada uno sea igual o mayor al promedio de todas las ventas realizadas por plantopia',
  })
  @ApiResponse({
    status: 200,
    description: 'Productos mas vendidos',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay ventas',
  })
  bestSellers(@Res() res: Response) {
    try {
      const resultado = this.productosService.bestSellers();
      res.status(200).send(resultado);
    } catch (error) {
      res.status(error.statusCode).send({ message: error.message });
    }
  }
  @ApiOperation({
    summary: 'Historia Usuario H003: Crea un nuevo producto',
    description:
      'Crea un nuevo producto de tipo planta dentro del catálogo de pruductos de plantopia',
  })
  @ApiResponse({ status: 200, description: 'Producto Creado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post('planta')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreatePlantaDto })
  crearPlanta(
    @Body()
    CreatePlantaDto: CreatePlantaDto,
    @Res() res: Response,
  ) {
    try {
      const resultado = this.productosService.createPlanta(CreatePlantaDto);
      res.status(200).send(resultado);
    } catch (error) {
      res.status(error.statusCode).send({
        message: error.message,
      });
    }
  }
  @ApiOperation({
    summary: 'Historia Usuario H003: Crea un nuevo producto',
    description:
      'Crea un nuevo producto de tipo fertilizante dentro del catálogo de pruductos de plantopia',
  })
  @ApiResponse({ status: 200, description: 'Producto Creado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post('fertilizante')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreateFertilizanteDto })
  crearFertilizante(
    @Body() CreateFertilizanteDto: CreateFertilizanteDto,
    @Res() res: Response,
  ) {
    try {
      const resultado = this.productosService.createFertilizante(
        CreateFertilizanteDto,
      );
      res.status(200).send(resultado);
    } catch (error) {
      res.status(error.statusCode).send({
        message: error.message,
      });
    }
  }
  @ApiOperation({
    summary: 'Historia Usuario H003: Crea un nuevo producto',
    description:
      'Crea un nuevo producto de tipo sustrato dentro del catálogo de pruductos de plantopia',
  })
  @ApiResponse({ status: 200, description: 'Producto Creado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post('sustrato')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreateSustratoDto })
  crearSustrato(
    @Body() createSustratoDto: CreateSustratoDto,
    @Res() res: Response,
  ) {
    try {
      const resultado = this.productosService.createSustrato(createSustratoDto);
      res.status(200).send(resultado);
    } catch (error) {
      res.status(error.statusCode).send({
        message: error.message,
      });
    }
  }
  @ApiOperation({
    summary: 'Historia Usuario H003: Crea un nuevo producto',
    description:
      'Crea un nuevo producto de tipo control-plagas dentro del catálogo de pruductos de plantopia',
  })
  @ApiResponse({ status: 200, description: 'Producto Creado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post('control-plagas')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreateControlPlagasDto })
  crearControlPlaga(
    @Body() CreateControlPlagasDto: CreateControlPlagasDto,
    @Res() res: Response,
  ) {
    try {
      const resultado = this.productosService.createControlPlagas(
        CreateControlPlagasDto,
      );
      res.status(200).send(resultado);
    } catch (error) {
      res.status(error.statusCode).send({
        message: error.message,
      });
    }
  }
  @ApiOperation({
    summary: 'Historia Usuario H003: Crea un nuevo producto',
    description:
      'Crea un nuevo producto de tipo macetero dentro del catálogo de pruductos de plantopia',
  })
  @ApiResponse({ status: 200, description: 'Producto Creado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post('macetero')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreateMaceteroDto })
  crearMacetero(
    @Body() CreateMaceteroDto: CreateMaceteroDto,
    @Res() res: Response,
  ) {
    try {
      const resultado = this.productosService.createMacetero(CreateMaceteroDto);
      res.status(200).send(resultado);
    } catch (error) {
      res.status(error.statusCode).send({
        message: error.message,
      });
    }
  }

  @Get('catalogo')
  @ApiOperation({
    summary: 'Historia Usuario H004: Listado de Productos Plantopia',
    description:
      'Lista todos los productos del catalogo de plantopia sin fitros',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de todos los productos',
  })
  findAll(@Res() res: Response) {
    const resultado = this.productosService.findAll();
    res.status(200).send(resultado);
  }

  @Get('catalogo/categoria')
  @ApiOperation({
    summary: 'Historia Usuario H004: Listado de Productos Plantopia',
    description:
      'Lista todos los productos del catalogo de plantopia filtrando por categoria(tipo de producto)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Listado de todos los productos filtrados por categoria(tipo productos)',
  })
  @ApiQuery({
    name: 'tipo',
    enum: TipoProductos,
    required: false,
    schema: { type: 'string' },
  })
  findbyType(
    @Query('tipo', new ParseEnumPipe(TipoProductos)) tipo: TipoProductos,
    @Res() res: Response,
  ) {
    const resultado = this.productosService.findbyType(tipo);
    if (resultado) {
      res.status(200).send(resultado);
    } else {
      res.status(400).send('no existen productos del filtro seleccionado');
    }
  }

  @Get('detalle/:codigoProducto')
  @ApiOperation({
    summary: 'Historia Usuario H007: Detalle de un producto',
    description:
      'Con el codigoProducto busca el detalle del producto, devolviendo todas las caracteristicas del producto y del tipo de producto al cual pertenece',
  })
  @ApiProperty({ name: 'codigoProducto', type: 'string', example: 'MA1' })
  @ApiResponse({ status: 200, description: 'Producto obtenido con éxito.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @ApiParam({
    name: 'codigoProducto',
    description: 'codigoProducto a obtener detalle',
    required: true,
    schema: { type: 'string' },
  })
  findOne(
    @Param('codigoProducto', CodigoProductoPipe) codigoProducto: string,
    @Res() res: Response,
  ) {
    try {
      const resultado = this.productosService.findOne(codigoProducto);
      res.status(200).send(resultado);
    } catch (error) {
      res.status(error.statusCode).send({ message: error.message });
    }
  }
}
