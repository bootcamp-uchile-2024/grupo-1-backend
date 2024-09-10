import { Test, TestingModule } from '@nestjs/testing';
import { PlantaCuidadosController } from './planta-cuidados.controller';
import { PlantaCuidadosService } from './planta-cuidados.service';

describe('PlantaCuidadosController', () => {
  let controller: PlantaCuidadosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantaCuidadosController],
      providers: [PlantaCuidadosService],
    }).compile();

    controller = module.get<PlantaCuidadosController>(PlantaCuidadosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
