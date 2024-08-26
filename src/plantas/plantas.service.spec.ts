import { Test, TestingModule } from '@nestjs/testing';
import { PlantasService } from './plantas.service';

describe('PlantasService', () => {
  let service: PlantasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantasService],
    }).compile();

    service = module.get<PlantasService>(PlantasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
