import { Test, TestingModule } from '@nestjs/testing';
import { ControlPlagasService } from './control-plagas.service';

describe('ControlPlagasService', () => {
  let service: ControlPlagasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControlPlagasService],
    }).compile();

    service = module.get<ControlPlagasService>(ControlPlagasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
