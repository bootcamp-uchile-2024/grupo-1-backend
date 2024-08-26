import { Test, TestingModule } from '@nestjs/testing';
import { DetalleOrdenComprasService } from './detalle-orden-compras.service';

describe('DetalleOrdenComprasService', () => {
  let service: DetalleOrdenComprasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleOrdenComprasService],
    }).compile();

    service = module.get<DetalleOrdenComprasService>(DetalleOrdenComprasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
