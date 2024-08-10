import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { Area } from 'src/models/Area';



@Controller('equipo')
export class EquipoController {

    constructor(private readonly equipoService: EquipoService) {
      
    }

     @Get('/informacion')
     getEquipo(){
       return this.equipoService.getEquipo()
     }
     
     @Get('informacion/areas')
     getAreas(@Query('nombreArea') nombreArea?: string): Area[] {
         return this.equipoService.getAreas(nombreArea ? nombreArea : undefined);
     }

     @Get('informacion/ecommerce')
      getEcommerce():object{
        console.log("ecommerce")
        return this.equipoService.getEcommerce();
      }
}
