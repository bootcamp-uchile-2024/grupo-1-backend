import { Test, TestingModule } from '@nestjs/testing';
import { FertilizantesController } from './fertilizantes.controller';
import { FertilizantesService } from './fertilizantes.service';

describe('FertilizantesController', () => {
  let controller: FertilizantesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FertilizantesController],
      providers: [FertilizantesService],
    }).compile();

    controller = module.get<FertilizantesController>(FertilizantesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
