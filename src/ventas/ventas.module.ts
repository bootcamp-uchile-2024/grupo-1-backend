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
@Module({
  imports: [
    TypeOrmModule.forFeature([OrdenCompra, DetalleOrdenCompra]),
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
  ],
})
export class VentasModule {}
