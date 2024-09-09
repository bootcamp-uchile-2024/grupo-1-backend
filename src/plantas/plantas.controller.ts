import { Controller, Get, Post, Body, Patch, Param, Delete, Res, ValidationPipe } from '@nestjs/common';
import { PlantasService } from './plantas.service';
import { CreatePlantaDto } from './dto/create-planta.dto';
import { UpdatePlantaDto } from './dto/update-planta.dto';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VerPlantas } from './dto/ver-plantas-dto';

@Controller('plantas')
export class PlantasController {
  constructor(private readonly plantasService: PlantasService) { }

  @Post()
  @ApiOperation({
    summary: 'Historia Usuario : H0003',
    description: 'Permite crear plantas para incorporar en catalogo de productos',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto tipo Planta creado en catalogo de productos',
 
  })
  create(@Body(new ValidationPipe()) createPlantaDto: CreatePlantaDto, @Res() res: Response) {
    res.status(200).send(createPlantaDto);
    //return this.plantasService.create(createPlantaDto);

  }
  @Get()
  @ApiOperation({
    summary: 'Historia Usuario : H0004',
    description: 'Como cliente quiero poder ver el catalogo de productos filtrados por categoria =  Plantas',
  })
  @ApiResponse({
    status: 200,
    description: 'Catálogo Plantas',
 
  })
  findAll(@Res() res:Response) {
    res.status(200).send(this.plantasService.findAll());
  }
  @Get('/MasVendidos/')
  @ApiOperation({
    summary: 'Historia Usuario : H0001 y H0002',
    description: 'Como cliente quiero ver los productos más vendidos ',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado Plantas mas vendidas ',
 
  })
  listaMasVendidas(@Res() res:Response) {
    res.status(200).send( this.plantasService.listaPlantasMasVendidas()) ;
  }
  

 
  
  /*
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.plantasService.findOne(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePlantaDto: UpdatePlantaDto) {
      return this.plantasService.update(+id, updatePlantaDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.plantasService.remove(+id);
    }*/
}
