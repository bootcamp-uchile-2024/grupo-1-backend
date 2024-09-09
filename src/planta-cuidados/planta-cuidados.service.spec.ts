import { Test, TestingModule } from '@nestjs/testing';
import { PlantaCuidadosService } from './planta-cuidados.service';

describe('PlantaCuidadosService', () => {
  let service: PlantaCuidadosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantaCuidadosService],
    }).compile();

    service = module.get<PlantaCuidadosService>(PlantaCuidadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
