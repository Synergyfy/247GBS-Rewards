import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { CampaignService } from './campaign.service.js';
import { CampaignPayload, CreateCampaignDto } from './dto/create-campaign.dto.js';
import { UpdateCampaignDto } from './dto/update-campaign.dto.js';
import { BusinessService } from '../business/business.service.js';
import { RewardService } from '../reward/reward.service.js';
import { BusinessDoesNotExistException } from '../../httpErrors/bussiness.error.js';
import { RewardDoesntExistException } from '../../httpErrors/reward.error.js';
import { CampaignDoesntExistException } from '../../httpErrors/campaign.error.js';
import { SkipAuth } from '../../core/decorators/skipAuth.decorator.js';
import { Reward } from '../reward/entities/reward.entity.js';
import { CreateSeasonDto } from './dto/create-season.dto.js';
import { SeasonService } from './season.service.js';
import { UpdateSeasonDto } from './dto/update-season.dto.js';
import { CampaignType } from '../../core/enums/campaignType.js';
import { Season } from './entities/season.entity.js';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { Campaign } from './entities/campaign.entity.js';
import { 
  CampaignStatsResponseDto, 
  CampaignRedemptionsResponseDto,
  CampaignCustomersResponseDto 
} from './dto/campaign-stats.dto.js';

@ApiTags('campaign')
@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly businessService: BusinessService,
    private readonly rewardService: RewardService,
    private readonly seasonService: SeasonService,
  ) {}

  @Post('season')
  @ApiOperation({ summary: 'Create a new season' })
  @ApiResponse({ status: 201, description: 'Season created successfully' })
  @ApiBody({ type: CreateSeasonDto })
  async createSeason(@Body() createSeasonDto: CreateSeasonDto) {
    return await this.seasonService.create(createSeasonDto);
  }

  @Get('season/business/:businessId')
  @ApiOperation({ summary: 'Get all seasons for a business' })
  @ApiResponse({ status: 200, description: 'List of seasons' })
  async findAllSeasonsByBusiness(@Param('businessId') businessId: string) {
    return await this.seasonService.findAllByBusiness(businessId);
  }

  @Get('season/:id')
  @ApiOperation({ summary: 'Get a season by ID' })
  @ApiResponse({ status: 200, description: 'Season details' })
  async findOneSeason(@Param('id') id: string) {
    return await this.seasonService.findOne(id);
  }

  @Patch('season/:id')
  @ApiOperation({ summary: 'Update a season' })
  @ApiResponse({ status: 200, description: 'Season updated successfully' })
  @ApiBody({ type: UpdateSeasonDto })
  async updateSeason(
    @Param('id') id: string,
    @Body() updateSeasonDto: UpdateSeasonDto,
  ) {
    return await this.seasonService.update(id, updateSeasonDto);
  }

  @Delete('season/:id')
  @ApiOperation({ summary: 'Delete a season' })
  @ApiResponse({ status: 200, description: 'Season deleted successfully' })
  async removeSeason(@Param('id') id: string) {
    return await this.seasonService.remove(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({
    status: 201,
    description: 'Campaign created successfully',
    type: Campaign,
  })
  @ApiBody({ type: CreateCampaignDto })
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    const { businessId, rewardIds, type, seasonId } = createCampaignDto;

    const business = await this.businessService.findOne(businessId);
    if (!business) throw new BusinessDoesNotExistException();
    const rewards = await this.rewardService.findByIds(rewardIds);
    if (rewards.length < 1) throw new RewardDoesntExistException();

    let season: Season = null;
    if (type === CampaignType.SEASONAL) {
      if (!seasonId) {
        throw new BadRequestException(
          'Season ID is required for seasonal campaigns',
        );
      }
      season = await this.seasonService.findOne(seasonId);
    }

    const campaign: CampaignPayload = {
      ...createCampaignDto,
      business,
      rewards,
      season,
    };

    return this.campaignService.create(campaign);
  }

  @Get('all-campaigns')
  @ApiOperation({ summary: 'Get all campaigns for the authenticated user' })
  @ApiQuery({
    name: 'type',
    enum: CampaignType,
    required: false,
    description: 'Filter campaigns by type',
  })
  @ApiResponse({
    status: 200,
    description: 'List of campaigns',
    type: [Campaign],
  })
  async findAll(@Req() req, @Query('type') type?: CampaignType) {
    const userId: string = req.user.userId;
    return await this.campaignService.findAllByUser(userId, type);
  }

  @Get(':id')
  @SkipAuth()
  @ApiOperation({ summary: 'Get a campaign by unique code' })
  @ApiResponse({ status: 200, description: 'Campaign details', type: Campaign })
  async findOne(@Param('id') id: string) {
    return await this.campaignService.findOneByCode(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get statistics for a campaign' })
  @ApiResponse({ 
    status: 200, 
    description: 'Campaign statistics.', 
    type: CampaignStatsResponseDto 
  })
  async getCampaignStats(@Req() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.campaignService.getCampaignStats(id, userId);
  }

  @Get(':id/customers')
  @ApiOperation({ summary: 'Get all customers that joined a campaign' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of customers.', 
    type: CampaignCustomersResponseDto 
  })
  async getCampaignCustomers(
    @Req() req,
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userId = req.user.userId;
    return this.campaignService.getCampaignCustomers(
      id,
      userId,
      Number(page),
      Number(limit),
    );
  }

  @Get(':id/redemptions')
  @ApiOperation({ summary: 'Get redemptions for a campaign' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of redemptions.', 
    type: CampaignRedemptionsResponseDto 
  })
  async getCampaignRedemptions(
    @Req() req,
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userId = req.user.userId;
    return this.campaignService.getCampaignRedemptions(
      id,
      userId,
      Number(page),
      Number(limit),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a campaign' })
  @ApiResponse({
    status: 200,
    description: 'Campaign updated successfully',
    type: Campaign,
  })
  @ApiBody({ type: UpdateCampaignDto })
  async update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    const campaign = await this.campaignService.findOne(id);
    if (!campaign) throw new CampaignDoesntExistException();
    const { rewardIds, type, seasonId } = updateCampaignDto;

    if (type === CampaignType.SEASONAL || (!type && campaign.type === CampaignType.SEASONAL)) {
      if (seasonId) {
        await this.seasonService.findOne(seasonId);
      } else if (type === CampaignType.SEASONAL && !campaign.season) {
         throw new BadRequestException('Season ID is required for seasonal campaigns');
      }
    }

    let rewards: Reward[];

    if (rewardIds && rewardIds.length > 0) {
      rewards = await this.rewardService.findByIds(rewardIds);
      if (rewards.length < 1) throw new RewardDoesntExistException();
    }
    return this.campaignService.update(campaign, updateCampaignDto, rewards);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campaign' })
  @ApiResponse({ status: 200, description: 'Campaign deleted successfully' })
  remove(@Param('id') id: string) {
    return this.campaignService.remove(id);
  }
}
