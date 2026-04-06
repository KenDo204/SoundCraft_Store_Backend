import { Test, TestingModule } from '@nestjs/testing';
import { GhnController } from './ghn.controller';
import { GhnService } from './ghn.service';

describe('GhnController', () => {
  let controller: GhnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GhnController],
      providers: [GhnService],
    }).compile();

    controller = module.get<GhnController>(GhnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
