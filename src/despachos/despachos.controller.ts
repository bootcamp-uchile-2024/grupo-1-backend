import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DespachosService } from './despachos.service';
import { CreateDespachoDto } from './dto/create-despacho.dto';
import { UpdateDespachoDto } from './dto/update-despacho.dto';

@Controller('despachos')
export class DespachosController {
  constructor(private readonly despachosService: DespachosService) {}

  @Post()
  create(@Body() createDespachoDto: CreateDespachoDto) {
    return this.despachosService.create(createDespachoDto);
  }

  @Get()
  findAll() {
    return this.despachosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.despachosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDespachoDto: UpdateDespachoDto) {
    return this.despachosService.update(+id, updateDespachoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.despachosService.remove(+id);
  }
}
