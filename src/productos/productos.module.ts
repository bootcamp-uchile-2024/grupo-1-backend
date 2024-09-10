import { Module } from '@nestjs/common';


import { MaceterosModule } from 'src/maceteros/maceteros.module';
import { PlantasModule } from 'src/plantas/plantas.module';
import { ProductosController } from './controller/productos.controller';
import { ProductosService } from './service/productos.service';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
  imports:[MaceterosModule,PlantasModule]
})
export class ProductosModule {}
