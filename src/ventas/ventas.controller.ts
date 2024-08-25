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
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@ApiTags('ventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ventas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ventas obtenida con éxito.',
  })
  findAll() {
    // lógica para obtener todas las ventas
    return this.ventasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una venta por ID' })
  @ApiResponse({ status: 200, description: 'Venta obtenida con éxito.' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada.' })
  findOne(@Param('id') id: string) {
    // lógica para obtener una venta por ID
    return this.ventasService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva venta' })
  @ApiResponse({ status: 201, description: 'Venta creada con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createVentaDto: any) {
    // lógica para crear una nueva venta
    return this.ventasService.create(createVentaDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una venta existente' })
  @ApiResponse({ status: 200, description: 'Venta actualizada con éxito.' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada.' })
  update(@Param('id') id: string, @Body() updateVentaDto: any) {
    // lógica para actualizar una venta existente
    return this.ventasService.update(+id, updateVentaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una venta' })
  @ApiResponse({ status: 200, description: 'Venta eliminada con éxito.' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada.' })
  remove(@Param('id') id: string) {
    // lógica para eliminar una venta
    return this.ventasService.remove(+id);
  }
}
