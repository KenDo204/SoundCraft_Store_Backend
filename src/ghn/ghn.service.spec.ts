import { Test, TestingModule } from '@nestjs/testing';
import { GhnService } from './ghn.service';

describe('GhnService', () => {
  let service: GhnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GhnService],
    }).compile();

    service = module.get<GhnService>(GhnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
