import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { OrdenComprasService } from './orden-compras.service';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden-compra.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
@ApiTags('Orden de Compra')
@Controller('orden-compras')
export class OrdenComprasController {
  constructor(private readonly ordenComprasService: OrdenComprasService) {}
  @ApiOperation({
    summary: 'Historia Usuario : H0005',
    description: 'Permite crear orden de compra con productos seleccionado',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden de Compra Creada desde carrito compras',
 
  })
  @Post()
  create(@Body() createOrdenCompraDto: CreateOrdenCompraDto, @Res() res:Response) {
    res.status(200).send(createOrdenCompraDto);
  }
/*
  @Get()
  findAll() {
    return this.ordenComprasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenComprasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdenCompraDto: UpdateOrdenCompraDto) {
    return this.ordenComprasService.update(+id, updateOrdenCompraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenComprasService.remove(+id);
  }*/
}
