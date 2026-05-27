import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UserService } from '../user/user.service';
import { UpdateRewardDto } from './dto/update-reward.dto';
import {
  CodeDoesntExistException,
  InsufficientBalanceException,
  RewardDoesntExistException,
} from '../../httpErrors/reward.error';
import {
  CreateCustomerNumberDto,
  CreateGenerateCodeDto,
  CreateGenerateRedeemCodeDto,
  ValidateCustomerNumberDto,
  ValidateCustomerRedeemNumberDto,
  verifyCodeDto,
  CreateBulkPointCodesDto,
} from './dto/create-gen-code.dto';
import { StaffService } from '../staff/staff.service';
import { StaffDoesntExistException } from '../../httpErrors/staff.error';
import { CampaignService } from '../campaign/campaign.service';
import { CampaignDoesntExistException } from '../../httpErrors/campaign.error';
import { CustomerService } from '../customer/customer.service';
import { UserDoesNotExistException } from '../../httpErrors/userErrors';
import { CampaignInactiveException } from '../../httpErrors/campaign-inactive.error';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { RedeemRewardDto } from './dto/redeem-reward.dto';
import { RewardStatsResponseDto, RewardRedemptionsResponseDto } from './dto/reward-stats.dto';

@ApiTags('Reward')
@ApiBearerAuth()
@Controller('reward')
export class RewardController {
  constructor(
    private readonly rewardService: RewardService,
    private readonly userService: UserService,
    private readonly staffService: StaffService,
    private readonly campaignService: CampaignService,
    private readonly customerService: CustomerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reward' })
  @ApiResponse({ status: 201, description: 'Reward created successfully.' })
  @ApiBody({ type: CreateRewardDto })
  async create(@Req() req, @Body() createRewardDto: CreateRewardDto) {
    const userId: string = req.user.userId;
    const user = await this.userService.findOne(userId);
    return await this.rewardService.create(createRewardDto, user);
  }

  @Get('all-rewards')
  @ApiOperation({ summary: 'Get all rewards for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of rewards.' })
  async findAllByUser(@Req() req) {
    const userId: string = req.user.userId;
    return this.rewardService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a reward by ID' })
  @ApiResponse({ status: 200, description: 'Reward found.' })
  findOne(@Param('id') id: string) {
    return this.rewardService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get statistics for a reward' })
  @ApiResponse({ 
    status: 200, 
    description: 'Reward statistics.', 
    type: RewardStatsResponseDto 
  })
  async getRewardStats(@Req() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.rewardService.getRewardStats(id, userId);
  }

  @Get(':id/redemptions')
  @ApiOperation({ summary: 'Get redemptions for a reward' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of redemptions.', 
    type: RewardRedemptionsResponseDto 
  })
  async getRewardRedemptions(
    @Req() req,
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userId = req.user.userId;
    return this.rewardService.getRewardRedemptions(
      id,
      userId,
      Number(page),
      Number(limit),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a reward by ID' })
  @ApiResponse({ status: 200, description: 'Reward updated successfully.' })
  @ApiBody({ type: UpdateRewardDto })
  async update(
    @Param('id') id: string,
    @Body() updateRewardDto: UpdateRewardDto,
  ) {
    const reward = await this.rewardService.findOne(id);
    if (!reward) throw new RewardDoesntExistException();
    return this.rewardService.update(reward, updateRewardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reward by ID' })
  @ApiResponse({ status: 200, description: 'Reward deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.rewardService.remove(id);
  }

  @Post('/generate-code')
  @ApiOperation({ summary: 'Generate a reward code' })
  @ApiResponse({ status: 201, description: 'Code generated successfully.' })
  @ApiBody({ type: CreateGenerateCodeDto })
  async createGenerateCode(@Req() req, @Body() payload: CreateGenerateCodeDto) {
    const userId: string = req.user.userId;
    const { campaignId, expires, points, type } = payload;

    const staff = await this.staffService.findOne(userId);

    if (!staff) throw new StaffDoesntExistException();

    const campaign = await this.campaignService.findOne(campaignId);

    if (!campaign) throw new CampaignDoesntExistException();

    if (!this.campaignService.isCampaignActive(campaign)) {
      throw new CampaignInactiveException();
    }

    return await this.rewardService.generateCode(
      campaign,
      staff,
      points,
      expires,
      type,
    );
  }

  @Post('/generate-bulk-codes')
  @ApiOperation({ summary: 'Generate bulk reward codes' })
  @ApiResponse({ status: 201, description: 'Codes generated successfully.' })
  @ApiBody({ type: CreateBulkPointCodesDto })
  async createGenerateBulkCodes(
    @Req() req,
    @Body() payload: CreateBulkPointCodesDto,
  ) {
    const userId: string = req.user.userId;
    const { campaignId, expires, points, type, quantity } = payload;

    let creator: any;
    try {
      creator = await this.staffService.findOne(userId);
    } catch (error) {
      // If staff not found, check if it's a user (admin)
    }

    if (!creator) {
      creator = await this.userService.findOne(userId);
    }

    if (!creator) throw new StaffDoesntExistException(); // Or UserDoesNotExist

    const campaign = await this.campaignService.findOne(campaignId);

    if (!campaign) throw new CampaignDoesntExistException();

    if (!this.campaignService.isCampaignActive(campaign)) {
      throw new CampaignInactiveException();
    }

    return await this.rewardService.generateBulkCodes(
      campaign,
      creator,
      points,
      quantity,
      expires,
      type,
    );
  }

  @Post('/redeem-self-service')
  @ApiOperation({ summary: 'Redeem a reward (self-service)' })
  @ApiResponse({ status: 200, description: 'Reward redeemed successfully.' })
  @ApiBody({ type: RedeemRewardDto })
  async redeemSelfService(@Req() req, @Body() payload: RedeemRewardDto) {
    const userId: string = req.user.userId;
    const { campaignId, rewardId } = payload;

    const customer = await this.customerService.findOne(userId);
    if (!customer) throw new UserDoesNotExistException();

    const campaign = await this.campaignService.findOne(campaignId);
    if (!campaign) throw new CampaignDoesntExistException();

    if (!this.campaignService.isCampaignActive(campaign)) {
      throw new CampaignInactiveException();
    }

    const result = await this.rewardService.redeemRewardSelfService(
      campaign,
      customer,
      rewardId,
    );

    if (result === 'reward not found') throw new RewardDoesntExistException();
    if (result === 'reward out of stock')
      throw new RewardDoesntExistException(); // Or specific exception
    if (result === 'insufficient point balance')
      throw new InsufficientBalanceException();

    return result;
  }


  @Get('all-campaigns/:id')
  @ApiOperation({ summary: 'Get all generated codes for a campaign' })
  @ApiResponse({ status: 200, description: 'List of generated codes.' })
  async findCodeByCampaigId(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.rewardService.getGenerateCodes(id, Number(page), Number(limit));
  }

  @Post('/verify-code')
  @ApiOperation({ summary: 'Verify a reward code' })
  @ApiResponse({ status: 200, description: 'Code verified successfully.' })
  @ApiBody({ type: verifyCodeDto })
  async createVerifyCode(@Req() req, @Body() payload: verifyCodeDto) {
    const userId: string = req.user.userId;
    const { campaignId, code, type } = payload;

    const customer = await this.customerService.findOne(userId);

    if (!customer) throw new UserDoesNotExistException();

    const campaign = await this.campaignService.findOne(campaignId);

    if (!campaign) throw new CampaignDoesntExistException();

    if (!this.campaignService.isCampaignActive(campaign)) {
      throw new CampaignInactiveException();
    }

    const validateCode = await this.rewardService.validateCode(
      campaign,
      customer,
      code,
      type,
    );

    if (!validateCode) throw new CodeDoesntExistException();

    return validateCode;
  }

  @Post('/customer-number')
  @ApiOperation({ summary: 'Generate a customer number for rewards' })
  @ApiResponse({ status: 201, description: 'Customer number generated.' })
  @ApiBody({ type: CreateCustomerNumberDto })
  async createCustomerNumber(
    @Req() req,
    @Body() payload: CreateCustomerNumberDto,
  ) {
    const userId: string = req.user.userId;
    const { campaignId } = payload;

    const customer = await this.customerService.findOne(userId);

    if (!customer) throw new UserDoesNotExistException();

    const campaign = await this.campaignService.findOne(campaignId);

    if (!campaign) throw new CampaignDoesntExistException();

    if (!this.campaignService.isCampaignActive(campaign)) {
      throw new CampaignInactiveException();
    }

    return await this.rewardService.generateCustomerNumber(campaign, customer);
  }

  @Post('/validate-cutomer-number')
  @ApiOperation({ summary: 'Validate a customer number' })
  @ApiResponse({ status: 200, description: 'Customer number validated.' })
  @ApiBody({ type: ValidateCustomerNumberDto })
  async validateCustomerNumber(
    @Req() req,
    @Body() payload: ValidateCustomerNumberDto,
  ) {
    const userId: string = req.user.userId;

    const staff = await this.staffService.findOne(userId);

    if (!staff) throw new StaffDoesntExistException();

    const { customerNumber, points, type } = payload;

    const pointsReward = await this.rewardService.validateCustomerNumber(
      customerNumber,
      points,
      type,
    );

    if (!pointsReward) throw new CodeDoesntExistException();

    if (pointsReward === 'campaign inactive') {
      throw new CampaignInactiveException();
    }

    return pointsReward;
  }

  @Get('all-points/:campaignId')
  @ApiOperation({ summary: 'Get customer points for a campaign' })
  @ApiResponse({ status: 200, description: 'Customer points balance.' })
  async getCustomerCampaignPoints(
    @Req() req,
    @Param('campaignId') campaignId: string,
  ) {
    const userId: string = req.user.userId;
    const points = await this.rewardService.getPointForCampaign(
      userId,
      campaignId,
    );

    return points;
  }

  @Post('/generate-redeem-code')
  @ApiOperation({ summary: 'Generate a redeem code' })
  @ApiResponse({ status: 201, description: 'Redeem code generated.' })
  @ApiBody({ type: CreateGenerateRedeemCodeDto })
  async createGenerateRedeemCode(
    @Req() req,
    @Body() payload: CreateGenerateRedeemCodeDto,
  ) {
    const userId: string = req.user.userId;
    const { campaignId, expires, rewardId } = payload;

    const staff = await this.staffService.findOne(userId);

    if (!staff) throw new StaffDoesntExistException();

    const campaign = await this.campaignService.findOne(campaignId);

    if (!campaign) throw new CampaignDoesntExistException();

    if (!this.campaignService.isCampaignActive(campaign)) {
      throw new CampaignInactiveException();
    }

    const reward = await this.rewardService.findOne(rewardId);
    if (!reward) throw new RewardDoesntExistException();

    return await this.rewardService.generateRewardCode(
      campaign,
      staff,
      reward,
      expires,
    );
  }

  @Post('/verify-redeem-code')
  @ApiOperation({ summary: 'Verify a redeem code' })
  @ApiResponse({ status: 200, description: 'Redeem code verified.' })
  @ApiBody({ type: verifyCodeDto })
  async createVerifyRedeemCode(@Req() req, @Body() payload: verifyCodeDto) {
    const userId: string = req.user.userId;
    const { campaignId, code } = payload;

    const customer = await this.customerService.findOne(userId);

    if (!customer) throw new UserDoesNotExistException();

    const campaign = await this.campaignService.findOne(campaignId);

    if (!campaign) throw new CampaignDoesntExistException();

    if (!this.campaignService.isCampaignActive(campaign)) {
      throw new CampaignInactiveException();
    }

    const validateCode = await this.rewardService.validateRewardCode(
      campaign,
      customer,
      code,
    );

    if (!validateCode) throw new CodeDoesntExistException();
    if (validateCode === 'insufficient point balance')
      throw new InsufficientBalanceException();

    return validateCode;
  }

  @Post('/customer-redeem-number')
  @ApiOperation({ summary: 'Generate a customer redeem number' })
  @ApiResponse({ status: 201, description: 'Customer redeem number generated.' })
  @ApiBody({ type: CreateCustomerNumberDto })
  async createCustomerRedeemNumber(
    @Req() req,
    @Body() payload: CreateCustomerNumberDto,
  ) {
    const userId: string = req.user.userId;
    const { campaignId, type } = payload;

    const customer = await this.customerService.findOne(userId);

    if (!customer) throw new UserDoesNotExistException();

    const campaign = await this.campaignService.findOne(campaignId);

    if (!campaign) throw new CampaignDoesntExistException();

    if (!this.campaignService.isCampaignActive(campaign)) {
      throw new CampaignInactiveException();
    }

    return await this.rewardService.generateRewardCustomerNumber(
      campaign,
      customer,
      type,
    );
  }

  @Post('/validate-cutomer-redeem-number')
  @ApiOperation({ summary: 'Validate a customer redeem number' })
  @ApiResponse({ status: 200, description: 'Customer redeem number validated.' })
  @ApiBody({ type: ValidateCustomerRedeemNumberDto })
  async validateCustomerRedeemNumber(
    @Req() req,
    @Body() payload: ValidateCustomerRedeemNumberDto,
  ) {
    const userId: string = req.user.userId;

    const staff = await this.staffService.findOne(userId);

    if (!staff) throw new StaffDoesntExistException();

    const { customerNumber, type, rewardId } = payload;

    const reward = await this.rewardService.findOne(rewardId);
    if (!reward) throw new RewardDoesntExistException();

    const pointsReward = await this.rewardService.validateCustomerRewardNumber(
      customerNumber,
      type,
      reward,
    );

    if (!pointsReward) throw new CodeDoesntExistException();
    if (pointsReward === 'campaign inactive') {
      throw new CampaignInactiveException();
    }
    if (pointsReward === 'insufficient point balance') {
      throw new InsufficientBalanceException();
    }

    return pointsReward;
  }

  @Get('all-customer-points/:campaignId')
  @ApiOperation({ summary: 'Get customer points history for a campaign' })
  @ApiResponse({ status: 200, description: 'Customer points history.' })
  async getCustomerCampaignPointsHistory(
    @Req() req,
    @Param('campaignId') campaignId: string,
  ) {
    const userId: string = req.user.userId;
    const user = await this.customerService.findOne(userId);
    if (!user) throw new UserDoesNotExistException();
    if (!campaignId) throw new CampaignDoesntExistException();

    const points = await this.rewardService.getCustomerPointHistory(
      campaignId,
      userId,
    );

    return points;
  }

  @Get('all-campaign-points/:campaignId')
  @ApiOperation({ summary: 'Get all points history for a campaign' })
  @ApiResponse({ status: 200, description: 'Campaign points history.' })
  async getCampaignPointsHistory(
    @Req() req,
    @Param('campaignId') campaignId: string,
  ) {
    const userId: string = req.user.userId;
    const user = await this.staffService.findOne(userId);
    if (!user) throw new UserDoesNotExistException();
    if (!campaignId) throw new CampaignDoesntExistException();

    const points = await this.rewardService.getCampaignPointHistory(campaignId);

    return points;
  }

  @Get('all-redeem-points/:campaignId')
  @ApiOperation({ summary: 'Get customer redeem history for a campaign' })
  @ApiResponse({ status: 200, description: 'Customer redeem history.' })
  async getCustomerCampaignRedeemPoints(
    @Req() req,
    @Param('campaignId') campaignId: string,
  ) {
    const userId: string = req.user.userId;
    const user = await this.customerService.findOne(userId);
    if (!user) throw new UserDoesNotExistException();

    const points = await this.rewardService.getCustomerRewardHistory(
      campaignId,
      userId,
    );

    return points;
  }

  @Get('all-campaign-redeem/:campaignId')
  @ApiOperation({ summary: 'Get all redeem history for a campaign' })
  @ApiResponse({ status: 200, description: 'Campaign redeem history.' })
  async getCampaignRedeemPoints(
    @Req() req,
    @Param('campaignId') campaignId: string,
  ) {
    const userId: string = req.user.userId;
    const user = await this.staffService.findOne(userId);
    if (!user) throw new UserDoesNotExistException();

    const points =
      await this.rewardService.getCampaignRewardHistory(campaignId);

    return points;
  }

  @Get('points-balance/:campaignId')
  @ApiOperation({ summary: 'Get customer points balance for a campaign' })
  @ApiResponse({ status: 200, description: 'Customer points balance.' })
  async getCustomerPointsBalance(
    @Req() req,
    @Param('campaignId') campaignId: string,
  ) {
    const userId: string = req.user.userId;
    const user = await this.customerService.findOne(userId);
    if (!user) throw new UserDoesNotExistException();

    const points = await this.rewardService.calculatePointBalance(
      campaignId,
      userId,
    );

    return points;
  }
}
