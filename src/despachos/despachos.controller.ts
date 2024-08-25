import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DespachosService } from './despachos.service';
import { CreateDespachoDto } from './dto/create-despacho.dto';
import { UpdateDespachoDto } from './dto/update-despacho.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('despachos')
@Controller('despachos')
export class DespachosController {
  constructor(private readonly despachosService: DespachosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los despachos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de despachos obtenida con éxito.',
  })
  findAll() {
    // lógica para obtener todos los despachos
    this.despachosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un despacho por ID' })
  @ApiResponse({ status: 200, description: 'Despacho obtenido con éxito.' })
  @ApiResponse({ status: 404, description: 'Despacho no encontrado.' })
  findOne(@Param('id') id: string) {
    // lógica para obtener un despacho por ID
    this.despachosService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo despacho' })
  @ApiResponse({ status: 201, description: 'Despacho creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createDespachoDto: any) {
    // lógica para crear un nuevo despacho
    this.despachosService.create(createDespachoDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un despacho existente' })
  @ApiResponse({ status: 200, description: 'Despacho actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Despacho no encontrado.' })
  update(@Param('id') id: string, @Body() updateDespachoDto: any) {
    // lógica para actualizar un despacho existente
    this.despachosService.update(+id, updateDespachoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un despacho' })
  @ApiResponse({ status: 200, description: 'Despacho eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Despacho no encontrado.' })
  remove(@Param('id') id: string) {
    // lógica para eliminar un despacho
    this.despachosService.remove(+id);
  }
}
