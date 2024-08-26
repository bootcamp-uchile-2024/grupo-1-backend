import { Module } from '@nestjs/common';
import { DetalleOrdenComprasService } from './detalle-orden-compras.service';
import { DetalleOrdenComprasController } from './detalle-orden-compras.controller';

@Module({
  controllers: [DetalleOrdenComprasController],
  providers: [DetalleOrdenComprasService],
})
export class DetalleOrdenComprasModule {}
