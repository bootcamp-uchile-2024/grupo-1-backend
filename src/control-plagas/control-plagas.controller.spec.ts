import { Test, TestingModule } from '@nestjs/testing';
import { ControlPlagasController } from './control-plagas.controller';
import { ControlPlagasService } from './control-plagas.service';

describe('ControlPlagasController', () => {
  let controller: ControlPlagasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlPlagasController],
      providers: [ControlPlagasService],
    }).compile();

    controller = module.get<ControlPlagasController>(ControlPlagasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
