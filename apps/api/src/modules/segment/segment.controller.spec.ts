import { Test, TestingModule } from '@nestjs/testing';
import { SegmentController } from './segment.controller.js';
import { SegmentService } from './segment.service.js';

describe('SegmentController', () => {
  let controller: SegmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SegmentController],
      providers: [SegmentService],
    }).compile();

    controller = module.get<SegmentController>(SegmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
