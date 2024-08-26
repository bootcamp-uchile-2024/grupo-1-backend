import { Module } from '@nestjs/common';
import { OrdenComprasService } from './orden-compras.service';
import { OrdenComprasController } from './orden-compras.controller';

@Module({
  controllers: [OrdenComprasController],
  providers: [OrdenComprasService],
})
export class OrdenComprasModule {}
