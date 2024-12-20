import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasController } from './controller/ventas.controller';
import { OrdenCompra } from './entities/orden_compra.entity';
import { DetalleOrdenCompra } from './entities/detalle_orden_compra.entity';
import { ProductosModule } from '../productos/productos.module'; // Importa el ProductosModule
import { DetalleOrdenComprasService } from './service/detalle-orden-compras.service';
import { OrdenComprasService } from './service/orden-compras.service';
import { ValidaEmailIdPipe } from 'src/comunes/pipes/validaEmailId.pipe';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { ValidaProductoCarritoPipe } from 'src/comunes/pipes/ValidaProductoCarrito,pipe';
import { ValidaEliminaProductoCarroPipe } from 'src/comunes/pipes/validaEliminaProductoCarro.pipe';
import { ValidaBuscaCarritoPipe } from 'src/comunes/pipes/validaBuscaCarrito.pipe';
import { VentasService } from './service/ventas.service';
import { Venta } from './entities/venta.entity';
import { FormaPago } from './entities/forma_pago.entity';
import { EstadosVenta } from './entities/estados_venta.entity';
import { JardinVirtual } from 'src/usuarios/entities/jardin_virtual.entity';
import { DetalleJardinVirtual } from 'src/usuarios/entities/detalle_jardin_virtual.entity';
import { Producto } from 'src/productos/entities/producto.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdenCompra,
      DetalleOrdenCompra,
      Venta,
      FormaPago,
      EstadosVenta,
      JardinVirtual,
      DetalleJardinVirtual,
      Producto,
    ]),
    ProductosModule,
    UsuariosModule,
  ],
  controllers: [VentasController],
  providers: [
    OrdenComprasService,
    DetalleOrdenComprasService,
    ValidaEmailIdPipe,
    ValidaProductoCarritoPipe,
    ValidaEliminaProductoCarroPipe,
    ValidaBuscaCarritoPipe,
    VentasService,
  ],
})
export class VentasModule {}
