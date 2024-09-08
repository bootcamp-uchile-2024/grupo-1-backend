import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { SustratosService } from './sustratos.service';
import { CreateSustratoDto } from './dto/create-sustrato.dto';
import { UpdateSustratoDto } from './dto/update-sustrato.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
@ApiTags('Sustratos')
@Controller('sustratos')
export class SustratosController {
  constructor(private readonly sustratosService: SustratosService) {}
  @ApiOperation({
    summary: 'Historia Usuario : H0003',
    description: 'Permite crear sustratos para incorporar en catalogo de productos',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto tipo sustrato creado en catalogo de productos',
 
  })
  @Post()
  create(@Body() createSustratoDto: CreateSustratoDto,@Res() res:Response) {
    res.status(200).send(createSustratoDto);
        //return this.sustratosService.create(createSustratoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Historia Usuario : H0004',
    description: 'Como cliente quiero poder ver el catalogo de productos filtrados por categoria =  Sustratos',
  })
  @ApiResponse({
    status: 200,
    description: 'Catalogo Sustratos',
 
  })
  findAll(@Res() res:Response) {
    res.status(200).send(this.sustratosService.findAll())
  }
  @Get('/MasVendidos/')
  @ApiOperation({
    summary: 'Historia Usuario : H0001 y H0002',
    description: 'Como cliente quiero ver los productos mas vendidos ',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado Sustratos mas vendidos ',
 
  })
  listaMasVendidas(@Res() res:Response) {
    res.status(200).send( this.sustratosService.listaMasVendidas()) ;
  }
  

 /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sustratosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSustratoDto: UpdateSustratoDto) {
    return this.sustratosService.update(+id, updateSustratoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sustratosService.remove(+id);
  }*/
}
