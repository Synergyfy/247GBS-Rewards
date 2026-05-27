import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Role } from '../../core/enums/roles';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { UserService } from '../user/user.service';
import { BusinessService } from '../business/business.service';
import { StaffService } from '../staff/staff.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { User } from '../user/entities/user.entity';
import { Business } from '../business/entities/business.entity';
import { Staff } from '../staff/entities/staff.entity';
import { CreateBusinessDto } from '../business/dto/create-business.dto';
import { UpdateBusinessDto } from '../business/dto/update-business.dto';
import { CreateCampaignDto } from '../campaign/dto/create-campaign.dto';
import { CampaignService } from '../campaign/campaign.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@ApiTags('Super Admin')
@ApiBearerAuth()
@Controller('super-admin')
@UseGuards(RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class SuperAdminController {
  constructor(
    private readonly userService: UserService,
    private readonly businessService: BusinessService,
    private readonly staffService: StaffService,
    private readonly analyticsService: AnalyticsService,
    private readonly campaignService: CampaignService,
  ) {}

  @Get('admins')
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({
    status: 200,
    description: 'Return all admins.',
    type: [User],
  })
  async getAllAdmins() {
    return this.userService.findAllAdmins();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: [User],
  })
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Get('admins/:id/businesses')
  @ApiOperation({ summary: 'Get businesses of a specific admin' })
  @ApiResponse({
    status: 200,
    description: 'Return businesses of the admin.',
    type: [Business],
  })
  async getAdminBusinesses(@Param('id') id: string) {
    return this.businessService.findAllBusinessByUser(id);
  }

  @Get('businesses/:id/staff')
  @ApiOperation({ summary: 'Get staff of a specific business' })
  @ApiResponse({
    status: 200,
    description: 'Return staff of the business.',
    type: [Staff],
  })
  async getBusinessStaff(@Param('id') id: string) {
    return this.staffService.findStaffByBusiness(id);
  }

  @Get('analytics/user/:id')
  @ApiOperation({ summary: 'Get overall analytics for a specific user' })
  async getUserAnalytics(@Param('id') id: string) {
    return this.analyticsService.getOverallAnalytics(id);
  }

  @Get('analytics/platform')
  @ApiOperation({ summary: 'Get overall platform analytics' })
  async getPlatformAnalytics() {
    return this.analyticsService.getPlatformAnalytics();
  }

  @Get('analytics/campaign/:id')
  @ApiOperation({ summary: 'Get analytics for a specific campaign' })
  async getCampaignAnalytics(@Param('id') id: string) {
    return this.analyticsService.getCampaignAnalytics(id);
  }

  // --- Management Endpoints ---

  @Post('users')
  @ApiOperation({ summary: 'Create a new user/admin' })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('users/:userId/business')
  @ApiOperation({ summary: 'Create a business for a specific user' })
  @ApiBody({ type: CreateBusinessDto })
  async createBusinessForUser(
    @Param('userId') userId: string,
    @Body() createBusinessDto: CreateBusinessDto,
  ) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new Error('User not found');
    return this.businessService.create(createBusinessDto, user);
  }

  @Patch('businesses/:id')
  @ApiOperation({ summary: 'Update a business' })
  @ApiBody({ type: UpdateBusinessDto })
  async updateBusiness(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    // We need to fetch the existing business to preserve the user/owner
    const business = await this.businessService.findOne(id);
    if (!business) throw new Error('Business not found');
    
    // We pass the existing user so ownership doesn't change
    // Note: BusinessService.update assigns the passed user. 
    // If we wanted to CHANGE ownership, we would fetch a new user.
    // Here we assume preservation.
    const owner = await this.userService.findOne(business.user.id);
    return this.businessService.update(id, updateBusinessDto, owner);
  }

  @Delete('businesses/:id')
  @ApiOperation({ summary: 'Delete a business' })
  async deleteBusiness(@Param('id') id: string) {
    return this.businessService.remove(id);
  }
}
