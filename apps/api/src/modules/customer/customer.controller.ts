import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JoinCampaignDto } from './dto/join-campaign.dto';
import { CustomerEmailExistException } from '../../httpErrors/customer.error';
import { SkipAuth } from '../../core/decorators/skipAuth.decorator';
import { PasswordFieldsDontMatch, UserDoesNotExistException } from '../../httpErrors/userErrors';
import { CampaignService } from '../campaign/campaign.service';
import { CampaignDoesntExistException } from '../../httpErrors/campaign.error';
import { CampaignInactiveException } from '../../httpErrors/campaign-inactive.error';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly campaignService: CampaignService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @SkipAuth()
  @ApiOperation({ summary: 'Register a new customer' })
  @ApiResponse({ status: 201, description: 'Customer registered successfully.' })
  @ApiResponse({ status: 400, description: 'Email exists or passwords do not match.' })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  @ApiBody({ type: CreateCustomerDto })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const { email, password, password2, campaignId } = createCustomerDto;

    const customerCheck =
      await this.customerService.checkEmailExistsForCampaign(email, campaignId);
    if (customerCheck) throw new CustomerEmailExistException();

    if (password !== password2) throw new PasswordFieldsDontMatch();

    const campaign = await this.campaignService.findOne(campaignId);

    if (!campaign) throw new CampaignDoesntExistException();

    if (!this.campaignService.isCampaignActive(campaign)) {
      throw new CampaignInactiveException();
    }

    const customer = await this.customerService.create(
      createCustomerDto,
      campaign,
    );
    return customer;
  }

  @Get('is-joined')
  @ApiOperation({ summary: 'Check if customer is joined to a campaign' })
  async isJoined(@Req() req, @Query('campaignId') campaignId: string) {
    const userId = req.user.userId;
    const user = await this.customerService.findOne(userId);
    if (!user) throw new UserDoesNotExistException();

    const joinedUser = await this.customerService.findOneByEmail(user.email, campaignId);
    if (joinedUser) {
        // Generate token for this specific campaign identity
        const payload = { sub: joinedUser.id, email: joinedUser.email };
        const token = await this.authService.login(payload);
        return { isJoined: true, token: token.accessToken };
    }
    
    return { isJoined: false };
  }

  @Post('join-campaign')
  @ApiOperation({ summary: 'Join a campaign' })
  async joinCampaign(@Req() req, @Body() dto: JoinCampaignDto) {
    const userId = req.user.userId;
    const user = await this.customerService.findOne(userId);
    if (!user) throw new UserDoesNotExistException();

    const result = await this.customerService.joinCampaign(user, dto.campaignId);
    
    // If successful, get the new user and generate token
    if (result.isJoined) {
        const newUser = await this.customerService.findOneByEmail(user.email, dto.campaignId);
        const payload = { sub: newUser.id, email: newUser.email };
        const token = await this.authService.login(payload);
        return { ...result, token: token.accessToken };
    }
    
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'List of customers.' })
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer found.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully.' })
  @ApiBody({ type: UpdateCustomerDto })
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
