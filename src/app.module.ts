import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DespachosModule } from './despachos/despachos.module';
import { ProductosModule } from './productos/productos.module';
import { ComprasModule } from './compras/compras.module';
import { VentasModule } from './ventas/ventas.module';
import { EquipoModule } from './equipo/equipo.module';

@Module({
  imports: [UsuariosModule, ProductosModule, DespachosModule, ComprasModule, VentasModule,EquipoModule],
  controllers: [AppController],
  providers: [AppService],
 })
export class AppModule {}
