import { Test, TestingModule } from '@nestjs/testing';
import { PlantasController } from './plantas.controller';
import { PlantasService } from './plantas.service';

describe('PlantasController', () => {
  let controller: PlantasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantasController],
      providers: [PlantasService],
    }).compile();

    controller = module.get<PlantasController>(PlantasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
