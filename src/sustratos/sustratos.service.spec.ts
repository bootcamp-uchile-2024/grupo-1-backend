import { Test, TestingModule } from '@nestjs/testing';
import { SustratosService } from './sustratos.service';

describe('SustratosService', () => {
  let service: SustratosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SustratosService],
    }).compile();

    service = module.get<SustratosService>(SustratosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
