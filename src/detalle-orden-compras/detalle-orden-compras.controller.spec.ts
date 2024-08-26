import { Test, TestingModule } from '@nestjs/testing';
import { DetalleOrdenComprasController } from './detalle-orden-compras.controller';
import { DetalleOrdenComprasService } from './detalle-orden-compras.service';

describe('DetalleOrdenComprasController', () => {
  let controller: DetalleOrdenComprasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetalleOrdenComprasController],
      providers: [DetalleOrdenComprasService],
    }).compile();

    controller = module.get<DetalleOrdenComprasController>(DetalleOrdenComprasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
