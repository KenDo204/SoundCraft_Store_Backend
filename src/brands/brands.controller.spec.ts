import { Test, TestingModule } from '@nestjs/testing';
import { brandsController } from './brands.controller';
import { brandsService } from './brands.service';

describe('brandsController', () => {
  let controller: brandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [brandsController],
      providers: [brandsService],
    }).compile();

    controller = module.get<brandsController>(brandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
