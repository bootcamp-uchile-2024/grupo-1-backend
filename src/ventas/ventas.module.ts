import { Module } from '@nestjs/common';
import { VentasController } from './controller/ventas.controller';
import { OrdenComprasService } from './service/orden-compras.service';
import { DetalleOrdenComprasService } from './service/detalle-orden-compras.service';
import { ProductosModule } from 'src/productos/productos.module';
@Module({
  controllers: [VentasController],
  providers: [OrdenComprasService, DetalleOrdenComprasService],
  exports: [OrdenComprasService, DetalleOrdenComprasService],
  imports: [ProductosModule],
})
export class VentasModule {}