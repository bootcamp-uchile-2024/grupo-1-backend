import { Test, TestingModule } from '@nestjs/testing';
import { FertilizantesService } from './fertilizantes.service';

describe('FertilizantesService', () => {
  let service: FertilizantesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FertilizantesService],
    }).compile();

    service = module.get<FertilizantesService>(FertilizantesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
