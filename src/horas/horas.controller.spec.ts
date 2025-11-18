import { Test, TestingModule } from '@nestjs/testing';
import { HorasController } from './horas.controller';
import { HorasService } from './horas.service';

describe('HorasController', () => {
  let controller: HorasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HorasController],
      providers: [HorasService],
    }).compile();

    controller = module.get<HorasController>(HorasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
