import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';

@ApiTags('compras')
@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las compras' })
  @ApiResponse({
    status: 200,
    description: 'Lista de compras obtenida con éxito.',
  })
  findAll() {
    // lógica para obtener todas las compras
    return this.comprasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una compra por ID' })
  @ApiResponse({ status: 200, description: 'Compra obtenida con éxito.' })
  @ApiResponse({ status: 404, description: 'Compra no encontrada.' })
  findOne(@Param('id') id: string) {
    // lógica para obtener una compra por ID
    return this.comprasService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva compra' })
  @ApiResponse({ status: 201, description: 'Compra creada con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createCompraDto: any) {
    // lógica para crear una nueva compra
    this.comprasService.create(createCompraDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una compra existente' })
  @ApiResponse({ status: 200, description: 'Compra actualizada con éxito.' })
  @ApiResponse({ status: 404, description: 'Compra no encontrada.' })
  update(@Param('id') id: string, @Body() updateCompraDto: any) {
    // lógica para actualizar una compra existente
    this.comprasService.update(+id, updateCompraDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una compra' })
  @ApiResponse({ status: 200, description: 'Compra eliminada con éxito.' })
  @ApiResponse({ status: 404, description: 'Compra no encontrada.' })
  remove(@Param('id') id: string) {
    // lógica para eliminar una compra
    this.comprasService.remove(+id);
  }
}
