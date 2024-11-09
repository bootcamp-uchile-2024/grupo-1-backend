import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasController } from './controller/ventas.controller';
import { OrdenCompra } from './entities/orden_compra.entity';
import { DetalleOrdenCompra } from './entities/detalle_orden_compra.entity';
import { ProductosModule } from '../productos/productos.module'; // Importa el ProductosModule
import { DetalleOrdenComprasService } from './service/detalle-orden-compras.service';
import { OrdenComprasService } from './service/orden-compras.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdenCompra, DetalleOrdenCompra]),
    ProductosModule, // Asegúrate de importar el ProductosModule
  ],
  controllers: [VentasController],
  providers: [OrdenComprasService, DetalleOrdenComprasService],
})
export class VentasModule {}
