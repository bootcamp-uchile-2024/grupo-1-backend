import { Test, TestingModule } from '@nestjs/testing';
import { OrdenComprasService } from './orden-compras.service';

describe('OrdenComprasService', () => {
  let service: OrdenComprasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdenComprasService],
    }).compile();

    service = module.get<OrdenComprasService>(OrdenComprasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
