import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
  ApiBody,
} from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida con éxito.',
  })
  findAll() {
    // lógica para obtener todos los productos
    this.productosService.findAll();
  }

  @Get(':idproducto')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiProperty({ name: 'idproducto', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'Producto obtenido con éxito.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  findOne(@Param('idproducto') idproducto: string) {
    // lógica para obtener un producto por ID
    this.productosService.findOne(+idproducto);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateProductoDto })
  create(@Body() createProductoDto: any) {
    // lógica para crear un nuevo producto
    this.productosService.create(createProductoDto);
  }

  @Patch(':idproducto')
  @ApiProperty({ name: 'idproducto', type: 'number', example: 1 })
  @ApiOperation({ summary: 'Actualizar un producto existente' })
  @ApiResponse({ status: 200, description: 'Producto actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  update(@Param('idproducto') id: string, @Body() updateProductoDto: any) {
    // lógica para actualizar un producto existente
    this.productosService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  remove(@Param('id') id: string) {
    // lógica para eliminar un producto
    this.productosService.remove(+id);
  }
}
