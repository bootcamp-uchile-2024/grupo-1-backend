import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { CreateMaceteroDto } from 'src/maceteros/dto/create-macetero.dto';
import { CodigoProductoPipe } from 'src/comunes/pipes/codigo-producto.pipe';
import { ProductosService } from '../service/productos.service';
import { TipoProductos } from '../entities/enum-productos';
@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) { }

  @Get('masvendidos')
  @ApiOperation({
    summary: 'Historia Usuario : H001 y H002',
    description: 'Como ussuario del sistema quiero ver los productos mas vendidos ',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de todos los productos mas vendidos',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay mas vendidos',
  })
  bestSellers(@Res() res: Response) {
    try{
      const resultado = this.productosService.bestSellers();
      res.status(200).send(resultado);
    }catch(error){
      res.status(error.statusCode).send({message: error.message })
    }
  }


/* INICIO HISTORIA 3 */
  /* crea un tipo producto macetero*/
  @ApiOperation({
    summary: 'Historia Usuario : H003',
    description: 'Permite crear macetero para incorporar en catalogo de productos',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto tipo Macetero creado en catalogo de productos',

  })
  @Post('macetero')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Crear un nuevo macetero' })
  @ApiResponse({ status: 200, description: 'Macetero creado.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateMaceteroDto })
  crearMacetero(@Body() CreateMaceteroDto: CreateMaceteroDto, @Res() res: Response) {
    try {
      const resultado = this.productosService.createMacetero(CreateMaceteroDto);
      res.status(200).send(resultado);
    } catch (error) {
      res.status(error.statusCode).send({
        message: error.message
      });
    }
  }
  /* ******************************** */  
  /* crea un tipo producto PLANTA*/
  /*@ApiOperation({
    summary: 'Historia Usuario : H003',
    description: 'Permite crear macetero para incorporar en catalogo de productos',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto tipo Macetero creado en catalogo de productos',
 
  })
  @Post('´plamta')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Crear una nueva Planta' })
  @ApiResponse({ status: 200, description: 'Planta creada.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateMaceteroDto })
  crearPlanta(@Body() CreateMaceteroDto:CreateMaceteroDto, @Res() res:Response){
    try {
      const resultado = this.productosService.createMacetero(CreateMaceteroDto);
      res.status(200).send(resultado);
    } catch (error) {
      res.status(error.statusCode).send({
        message: error.message
      });
    }
  }
*/


  /************************************************* */
  /* crea un tipo producto SUSTRATO*/
  /*@ApiOperation({
    summary: 'Historia Usuario : H003',
    description: 'Permite crear macetero para incorporar en catalogo de productos',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto tipo Macetero creado en catalogo de productos',
 
  })
  @Post('sustrato')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Crear una nueva Planta' })
  @ApiResponse({ status: 200, description: 'Planta creada.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateMaceteroDto })
  crearSustrato(@Body() CreateMaceteroDto:CreateMaceteroDto, @Res() res:Response){
    try {
      const resultado = this.productosService.createMacetero(CreateMaceteroDto);
      res.status(200).send(resultado);
    } catch (error) {
      res.status(error.statusCode).send({
        message: error.message
      });
    }
  }
*/

  /************************************************* */
  /* crea un tipo producto FERTILIZANTE*/
  /*@ApiOperation({
    summary: 'Historia Usuario : H003',
    description: 'Permite crear macetero para incorporar en catalogo de productos',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto tipo Macetero creado en catalogo de productos',
 
  })
  @Post('fertilizante')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Crear una nueva Planta' })
  @ApiResponse({ status: 200, description: 'Planta creada.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateMaceteroDto })
  crearFertilizante(@Body() CreateMaceteroDto:CreateMaceteroDto, @Res() res:Response){
    try {
      const resultado = this.productosService.createMacetero(CreateMaceteroDto);
      res.status(200).send(resultado);
    } catch (error) {
      res.status(error.statusCode).send({
        message: error.message
      });
    }
  }
*/
  /************************************************* */
  /* crea un tipo producto CONTROL PLAGAS*/
  /*@ApiOperation({
    summary: 'Historia Usuario : H003',
    description: 'Permite crear macetero para incorporar en catalogo de productos',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto tipo Macetero creado en catalogo de productos',
 
  })
  @Post('control-plagas')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Crear una nueva Planta' })
  @ApiResponse({ status: 200, description: 'Planta creada.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateMaceteroDto })
  crearControlPlaga(@Body() CreateMaceteroDto:CreateMaceteroDto, @Res() res:Response){
    try {
      const resultado = this.productosService.createMacetero(CreateMaceteroDto);
      res.status(200).send(resultado);
    } catch (error) {
      res.status(error.statusCode).send({
        message: error.message
      });
    }
  }
*/
  /**************** fin HISTORIA 3 */



  @Get('catalogo')
  @ApiOperation({
    summary: 'Historia Usuario : H004',
    description: 'Como cliente quiero poder ver el catalogo de productos',
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
    summary: 'Historia Usuario : H004',
    description: 'Como cliente quiero poder ver el catalogo de productos filtrados por categoria para poder encontrar los productos que quiero',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de Productos Filtrados por Tipo Producto',
  })
  @ApiQuery({ name: 'tipo', enum: TipoProductos, required: false, schema: { type: 'number' } })
  findbyType(@Query('tipo', new ParseEnumPipe(TipoProductos)) tipo: TipoProductos, @Res() res: Response) {
    const resultado = this.productosService.findbyType(tipo);
    if (resultado) {
      res.status(200).send(resultado);
    } else {
      res.status(400).send('no existen productos del filtro seleccionado');
    }
  }



  @Get('detalle/:codigoProducto')
  @ApiOperation({
    summary: 'Historia Usuario : H007',
    description: 'Como cliente quiero poder buscar producto y ver detalle de el para ver si cumple lo que necesito',
  })
  @ApiProperty({ name: 'codigoProducto', type: 'string', example: 'MA1' })
  @ApiResponse({ status: 200, description: 'Producto obtenido con éxito.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  findOne(@Param('codigoProducto',CodigoProductoPipe) codigoProducto:string , @Res() res: Response) {
    try {
      const resultado = this.productosService.findOne(codigoProducto);
      res.status(200).send(resultado);
    } catch (error) {
      res.status(error.statusCode).send({ message: error.message })
    }

  }

  



}
