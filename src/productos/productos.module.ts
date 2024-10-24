import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa TypeOrmModule
import { ProductosController } from './controller/productos.controller';
import { ProductosService } from './service/productos.service';
import { Producto } from 'entitipt/producto.entity';

// Si estos servicios son necesarios, puedes descomentarlos cuando sea necesario
// import { SustratosService } from './service/sustratos.service';
// import { PlantasService } from './service/plantas.service';
// import { MaceterosService } from './service/maceteros.service';
// import { FertilizantesService } from './service/fertilizantes.service';
// import { ControlPlagasService } from './service/control-plagas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]), // Asegúrate de importar el repositorio de Producto
  ],
  controllers: [ProductosController],
  providers: [
    ProductosService,
    // SustratosService,
    // PlantasService,
    // MaceterosService,
    // FertilizantesService,
    // ControlPlagasService,
  ],
  exports: [
    ProductosService,
    // SustratosService,
    // PlantasService,
    // MaceterosService,
    // FertilizantesService,
    // ControlPlagasService,
  ],
})
export class ProductosModule {}
