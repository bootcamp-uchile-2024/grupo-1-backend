import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasController } from './controller/ventas.controller';
import { OrdenComprasService } from './service/orden-compras.service';
import { DetalleOrdenComprasService } from './service/detalle-orden-compras.service';
import { OrdenCompra } from './entities/orden-compra.entity';
import { DetalleOrdenCompra } from './entities/detalle-orden-compra.entity';
import { ProductosModule } from 'src/productos/productos.module';
import { Producto } from 'entitychr/producto-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdenCompra, DetalleOrdenCompra, Producto]),
    ProductosModule,
  ],
  controllers: [VentasController],
  providers: [OrdenComprasService, DetalleOrdenComprasService],
  exports: [OrdenComprasService, DetalleOrdenComprasService],
})
export class VentasModule {}
