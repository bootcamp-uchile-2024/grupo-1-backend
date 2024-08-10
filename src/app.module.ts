import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
import { UsuariosModule } from './usuarios/usuarios.module';
import { DespachosModule } from './despachos/despachos.module';
import { ProductosModule } from './productos/productos.module';
//import { UsuariosModule } from './usuarios/usuarios.module';
import { ComprasModule } from './compras/compras.module';
import { VentasModule } from './ventas/ventas.module';

@Module({
  imports: [UsuariosModule, ProductosModule, DespachosModule, ComprasModule, VentasModule],
  controllers: [AppController],
  providers: [AppService],
=======
import { EquipoModule } from './equipo/equipo.module';
import { EquipoController } from './equipo/equipo.controller';
import { EquipoService } from './equipo/equipo.service';

@Module({
  imports: [EquipoModule],
  controllers: [AppController,EquipoController],
  providers: [AppService,EquipoService],
>>>>>>> equipo
})
export class AppModule {}
