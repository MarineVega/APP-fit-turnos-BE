import { Test, TestingModule } from '@nestjs/testing';
import { HorasService } from './horas.service';

describe('HorasService', () => {
  let service: HorasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HorasService],
    }).compile();

    service = module.get<HorasService>(HorasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
