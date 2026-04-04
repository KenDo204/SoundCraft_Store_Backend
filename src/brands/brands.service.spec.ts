import { Test, TestingModule } from '@nestjs/testing';
import { brandsService } from './brands.service';

describe('brandsService', () => {
  let service: brandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [brandsService],
    }).compile();

    service = module.get<brandsService>(brandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
