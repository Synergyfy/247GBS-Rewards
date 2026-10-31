import { Test, TestingModule } from '@nestjs/testing';
import { CampaignController } from './campaign.controller.js';
import { CampaignService } from './campaign.service.js';

describe('CampaignController', () => {
  let controller: CampaignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignController],
      providers: [CampaignService],
    }).compile();

    controller = module.get<CampaignController>(CampaignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
