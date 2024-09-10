import { Module } from '@nestjs/common';


import { MaceterosModule } from 'src/maceteros/maceteros.module';
import { PlantasModule } from 'src/plantas/plantas.module';
import { ProductosController } from './controller/productos.controller';
import { ProductosService } from './service/productos.service';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
<<<<<<< HEAD
  imports:[MaceterosModule,PlantasModule]
=======
  imports:[MaceterosModule],
  exports:[ProductosService]
>>>>>>> main
})
export class ProductosModule {}
