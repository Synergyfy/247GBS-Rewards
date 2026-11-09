import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Role } from '../../core/enums/roles.js';
import { Roles } from '../../core/decorators/roles.decorator.js';
import { RolesGuard } from '../../core/guards/roles.guard.js';

import { SuperAdminService } from './super-admin.service.js';

import { AdminListQueryDto, UserListQueryDto } from './dto/user.dto.js';
import {
  CreateBusinessForUserDto,
  DeleteReasonDto,
  IdParamDto,
  ResetPasswordDto,
  SetUserStatusDto,
  UpdateBusinessAdminDto,
  UpdateStaffAdminDto,
  UpdateUserAdminDto,
  UserIdParamDto,
} from './dto/user.dto.js';
import { BusinessListQueryDto } from './dto/business-query.dto.js';
import {
  CampaignListQueryDto,
  SetCampaignStatusDto,
} from './dto/campaign.dto.js';
import {
  CustomerListQueryDto,
  PointsAdjustmentDto,
} from './dto/customer.dto.js';
import { RedemptionListQueryDto } from './dto/redemption-query.dto.js';
import { AuditLogListQueryDto } from './dto/audit-log-query.dto.js';
import { AnalyticsRangeQueryDto } from './dto/analytics-query.dto.js';
import {
  CampaignCodeListQueryDto,
  PaginatedCampaignCodesResponseDto,
  RevokeCodeDto,
} from './dto/code-query.dto.js';
import {
  CampaignAnalyticsResponseDto,
  CustomerProfileResponseDto,
  PaginatedAdminsResponseDto,
  PaginatedAuditLogsResponseDto,
  PaginatedBusinessesResponseDto,
  PaginatedCampaignsResponseDto,
  PaginatedCustomersResponseDto,
  PaginatedRedemptionsResponseDto,
  PaginatedUsersResponseDto,
  PlatformAnalyticsResponseDto,
  SuccessResponseDto,
  TemporaryPasswordResponseDto,
  UserAnalyticsResponseDto,
  UserWithBusinessesResponseDto,
} from './dto/response.dto.js';
import { Business } from '../business/entities/business.entity.js';
import { Staff } from '../staff/entities/staff.entity.js';
import { Campaign } from '../campaign/entities/campaign.entity.js';
import { CustomerPoint } from '../reward/entities/customerPoints.entity.js';
import { User } from '../user/entities/user.entity.js';
import { CreateUserDto } from '../user/dto/create-user.dto.js';

interface AuthenticatedRequest {
  user?: { userId?: string; email?: string; role?: Role };
  ip?: string;
  headers?: Record<string, string | string[] | undefined>;
}

function actorId(req: AuthenticatedRequest): string | undefined {
  return req.user?.userId;
}

function clientIp(req: AuthenticatedRequest): string | undefined {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (Array.isArray(forwarded)) return forwarded[0]?.split(',')[0]?.trim();
  if (typeof forwarded === 'string') return forwarded.split(',')[0]?.trim();
  return req.ip;
}

@ApiTags('Super Admin')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
@ApiForbiddenResponse({ description: 'The caller is not a super admin.' })
@Controller('super-admin')
@UseGuards(RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  // -------------------------------------------------------------------------
  // Admins / users
  // -------------------------------------------------------------------------

  @Get('admins')
  @ApiOperation({
    summary: 'List admin accounts',
    description:
      'Paginated business-owner accounts with their business, campaign and customer counts.',
  })
  @ApiOkResponse({ type: PaginatedAdminsResponseDto })
  async listAdmins(
    @Query() query: AdminListQueryDto,
  ): Promise<PaginatedAdminsResponseDto> {
    return this.superAdminService.listAdmins(query) as unknown as Promise<PaginatedAdminsResponseDto>;
  }

  @Get('users')
  @ApiOperation({
    summary: 'List users',
    description:
      'Paginated users, filterable by role, signup source, status and creation date.',
  })
  @ApiOkResponse({ type: PaginatedUsersResponseDto })
  async listUsers(
    @Query() query: UserListQueryDto,
  ): Promise<PaginatedUsersResponseDto> {
    return this.superAdminService.listUsers(query) as unknown as Promise<PaginatedUsersResponseDto>;
  }

  @Post('users')
  @ApiOperation({
    summary: 'Create a user or admin account',
    description:
      'Creates a Users-table account. The role defaults to admin; a super admin may create another super admin.',
  })
  @ApiCreatedResponse({ type: User })
  @ApiConflictResponse({ description: 'Email or phone number already in use.' })
  @ApiBody({ type: CreateUserDto })
  async createUser(
    @Body() dto: CreateUserDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    return this.superAdminService.createUser(dto, actorId(req), clientIp(req));
  }

  @Get('users/:id')
  @ApiOperation({
    summary: 'Get one user',
    description: 'Returns the account and every business it owns.',
  })
  @ApiOkResponse({ type: UserWithBusinessesResponseDto })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async getUser(@Param() params: IdParamDto) {
    return this.superAdminService.getUser(params.id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Update a user account' })
  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse({ description: 'Invalid payload.' })
  @ApiConflictResponse({ description: 'Email or phone number already in use.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiBody({ type: UpdateUserAdminDto })
  async updateUser(
    @Param() params: IdParamDto,
    @Body() dto: UpdateUserAdminDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    return this.superAdminService.updateUser(
      params.id,
      dto,
      actorId(req),
      clientIp(req),
    );
  }

  @Patch('users/:id/status')
  @ApiOperation({
    summary: 'Activate or deactivate a user account',
    description:
      'The change is recorded in the super-admin audit log with an optional reason.',
  })
  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse({ description: 'A super admin cannot deactivate themselves.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiBody({ type: SetUserStatusDto })
  async setUserStatus(
    @Param() params: IdParamDto,
    @Body() dto: SetUserStatusDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    return this.superAdminService.setUserStatus(
      params.id,
      dto,
      actorId(req),
      clientIp(req),
    );
  }

  @Post('users/:id/reset-password')
  @ApiOperation({
    summary: 'Issue a temporary password',
    description:
      'Generates a one-time temporary password and records the reason in the audit log.',
  })
  @ApiCreatedResponse({ type: TemporaryPasswordResponseDto })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(
    @Param() params: IdParamDto,
    @Body() dto: ResetPasswordDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<TemporaryPasswordResponseDto> {
    return this.superAdminService.resetPassword(
      params.id,
      dto,
      actorId(req),
      clientIp(req),
    );
  }

  @Delete('users/:id')
  @ApiOperation({
    summary: 'Delete a user account',
    description:
      'Also deletes the businesses owned by the user (and their cascaded campaign data).',
  })
  @ApiOkResponse({ type: SuccessResponseDto })
  @ApiBadRequestResponse({ description: 'A super admin cannot delete themselves.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiBody({ type: DeleteReasonDto })
  async deleteUser(
    @Param() params: IdParamDto,
    @Body() dto: DeleteReasonDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ success: true }> {
    return this.superAdminService.deleteUser(
      params.id,
      dto,
      actorId(req),
      clientIp(req),
    );
  }

  @Get('admins/:id/businesses')
  @ApiOperation({ summary: 'List the businesses owned by an admin' })
  @ApiOkResponse({ type: [Business] })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async getAdminBusinesses(@Param() params: IdParamDto): Promise<Business[]> {
    return this.superAdminService.getAdminBusinesses(params.id);
  }

  @Post('users/:userId/business')
  @ApiOperation({
    summary: 'Create a business for a user',
    description:
      'Creates a business owned by the given admin. Address and social profiles can be filled in later.',
  })
  @ApiCreatedResponse({ type: Business })
  @ApiConflictResponse({ description: 'Business email or phone number already in use.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiBody({ type: CreateBusinessForUserDto })
  async createBusinessForUser(
    @Param() params: UserIdParamDto,
    @Body() dto: CreateBusinessForUserDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Business> {
    return this.superAdminService.createBusinessForUser(
      params.userId,
      dto,
      actorId(req),
      clientIp(req),
    );
  }

  // -------------------------------------------------------------------------
  // Businesses / staff
  // -------------------------------------------------------------------------

  @Get('businesses')
  @ApiOperation({
    summary: 'List businesses',
    description:
      'Paginated businesses, optionally scoped to one owner. Each row includes the owner and campaign ids.',
  })
  @ApiOkResponse({ type: PaginatedBusinessesResponseDto })
  async listBusinesses(
    @Query() query: BusinessListQueryDto,
  ): Promise<PaginatedBusinessesResponseDto> {
    return this.superAdminService.listBusinesses(query) as unknown as Promise<PaginatedBusinessesResponseDto>;
  }

  @Get('businesses/:id')
  @ApiOperation({
    summary: 'Get a business with its campaigns, staff, segments and seasons',
  })
  @ApiOkResponse({ type: Business })
  @ApiNotFoundResponse({ description: 'Business not found.' })
  async getBusiness(@Param() params: IdParamDto): Promise<Business> {
    return this.superAdminService.getBusiness(params.id);
  }

  @Patch('businesses/:id')
  @ApiOperation({ summary: 'Update a business' })
  @ApiOkResponse({ type: Business })
  @ApiConflictResponse({ description: 'Business email or phone number already in use.' })
  @ApiNotFoundResponse({ description: 'Business not found.' })
  @ApiBody({ type: UpdateBusinessAdminDto })
  async updateBusiness(
    @Param() params: IdParamDto,
    @Body() dto: UpdateBusinessAdminDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Business> {
    return this.superAdminService.updateBusiness(
      params.id,
      dto,
      actorId(req),
      clientIp(req),
    );
  }

  @Delete('businesses/:id')
  @ApiOperation({
    summary: 'Delete a business',
    description:
      'Cascades to campaigns, staff, segments, seasons, links and campaign customers.',
  })
  @ApiOkResponse({ type: SuccessResponseDto })
  @ApiNotFoundResponse({ description: 'Business not found.' })
  @ApiBody({ type: DeleteReasonDto })
  async deleteBusiness(
    @Param() params: IdParamDto,
    @Body() dto: DeleteReasonDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ success: true }> {
    return this.superAdminService.deleteBusiness(
      params.id,
      dto,
      actorId(req),
      clientIp(req),
    );
  }

  @Get('businesses/:id/staff')
  @ApiOperation({ summary: 'List the staff members of a business' })
  @ApiOkResponse({ type: [Staff] })
  @ApiNotFoundResponse({ description: 'Business not found.' })
  async getBusinessStaff(@Param() params: IdParamDto): Promise<Staff[]> {
    return this.superAdminService.businessStaff(params.id);
  }

  @Patch('staff/:id')
  @ApiOperation({ summary: 'Update a staff member' })
  @ApiOkResponse({ type: Staff })
  @ApiConflictResponse({ description: 'Staff email address already in use.' })
  @ApiNotFoundResponse({ description: 'Staff member not found.' })
  @ApiBody({ type: UpdateStaffAdminDto })
  async updateStaff(
    @Param() params: IdParamDto,
    @Body() dto: UpdateStaffAdminDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Staff> {
    return this.superAdminService.updateStaff(
      params.id,
      dto,
      actorId(req),
      clientIp(req),
    );
  }

  // -------------------------------------------------------------------------
  // Campaigns
  // -------------------------------------------------------------------------

  @Get('campaigns')
  @ApiOperation({
    summary: 'List campaigns',
    description:
      'Paginated campaigns across every business. Seasonal status is evaluated against the season dates.',
  })
  @ApiOkResponse({ type: PaginatedCampaignsResponseDto })
  async listCampaigns(
    @Query() query: CampaignListQueryDto,
  ): Promise<PaginatedCampaignsResponseDto> {
    return this.superAdminService.listCampaigns(query) as unknown as Promise<PaginatedCampaignsResponseDto>;
  }

  @Get('campaigns/:id')
  @ApiOperation({ summary: 'Get a campaign with its business and rewards' })
  @ApiOkResponse({ type: Campaign })
  @ApiNotFoundResponse({ description: 'Campaign not found.' })
  async getCampaign(@Param() params: IdParamDto): Promise<Campaign> {
    return this.superAdminService.getCampaign(params.id);
  }

  @Get('campaigns/:id/codes')
  @ApiOperation({
    summary: 'List codes issued in a campaign',
    description:
      'One kind at a time: staff point codes, staff reward codes, reward numbers or customer numbers. Any row can be revoked with DELETE codes/:id.',
  })
  @ApiOkResponse({ type: PaginatedCampaignCodesResponseDto })
  @ApiNotFoundResponse({ description: 'Campaign not found.' })
  async listCampaignCodes(
    @Param() params: IdParamDto,
    @Query() query: CampaignCodeListQueryDto,
  ): Promise<PaginatedCampaignCodesResponseDto> {
    return this.superAdminService.listCampaignCodes(params.id, query);
  }

  @Patch('campaigns/:id/status')
  @ApiOperation({
    summary: 'Activate or deactivate a campaign',
    description:
      'The stored flag is combined with the season window for seasonal campaigns.',
  })
  @ApiOkResponse({ type: Campaign })
  @ApiNotFoundResponse({ description: 'Campaign not found.' })
  @ApiBody({ type: SetCampaignStatusDto })
  async setCampaignStatus(
    @Param() params: IdParamDto,
    @Body() dto: SetCampaignStatusDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Campaign> {
    return this.superAdminService.setCampaignStatus(
      params.id,
      dto,
      actorId(req),
      clientIp(req),
    );
  }

  // -------------------------------------------------------------------------
  // Analytics
  // -------------------------------------------------------------------------

  @Get('analytics/platform')
  @ApiOperation({
    summary: 'Get platform-wide analytics',
    description:
      'Cached for 60 seconds. Defaults to the last 30 days when no range is supplied.',
  })
  @ApiOkResponse({ type: PlatformAnalyticsResponseDto })
  async getPlatformAnalytics(
    @Query() query: AnalyticsRangeQueryDto,
  ): Promise<PlatformAnalyticsResponseDto> {
    return this.superAdminService.getPlatformAnalytics(query.from, query.to);
  }

  @Get('analytics/user/:id')
  @ApiOperation({ summary: 'Get analytics for one admin account' })
  @ApiOkResponse({ type: UserAnalyticsResponseDto })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async getUserAnalytics(
    @Param() params: IdParamDto,
  ): Promise<UserAnalyticsResponseDto> {
    return this.superAdminService.getUserAnalytics(params.id);
  }

  @Get('analytics/business/:id')
  @ApiOperation({
    summary: 'Get analytics for one business',
    description:
      'Campaign, customer, points-issued and redemption totals across the business campaigns. Cached briefly.',
  })
  @ApiOkResponse({ type: UserAnalyticsResponseDto })
  @ApiNotFoundResponse({ description: 'Business not found.' })
  async getBusinessAnalytics(
    @Param() params: IdParamDto,
  ): Promise<UserAnalyticsResponseDto> {
    return this.superAdminService.getBusinessAnalytics(params.id);
  }

  @Get('analytics/campaign/:id')
  @ApiOperation({ summary: 'Get analytics for one campaign' })
  @ApiOkResponse({ type: CampaignAnalyticsResponseDto })
  @ApiNotFoundResponse({ description: 'Campaign not found.' })
  async getCampaignAnalytics(
    @Param() params: IdParamDto,
  ): Promise<CampaignAnalyticsResponseDto> {
    return this.superAdminService.getCampaignAnalytics(params.id);
  }

  // -------------------------------------------------------------------------
  // Customers / redemptions / codes
  // -------------------------------------------------------------------------

  @Get('customers')
  @ApiOperation({
    summary: 'List customers grouped by person',
    description:
      'One row per email (case-insensitive) with all matching campaign memberships, newest first.',
  })
  @ApiOkResponse({ type: PaginatedCustomersResponseDto })
  async listCustomers(
    @Query() query: CustomerListQueryDto,
  ): Promise<PaginatedCustomersResponseDto> {
    return this.superAdminService.listCustomers(query) as unknown as Promise<PaginatedCustomersResponseDto>;
  }

  @Get('customers/:id')
  @ApiOperation({
    summary: 'Get a customer profile',
    description:
      ':id can be any membership id; the response covers every campaign joined by that email.',
  })
  @ApiOkResponse({ type: CustomerProfileResponseDto })
  @ApiNotFoundResponse({ description: 'Customer not found.' })
  async getCustomer(
    @Param() params: IdParamDto,
  ): Promise<CustomerProfileResponseDto> {
    return this.superAdminService.getCustomer(params.id);
  }

  @Post('customers/:id/points-adjustment')
  @ApiOperation({
    summary: 'Add or remove customer points for a campaign',
    description:
      ':id is the customer membership receiving the adjustment. A ledger entry and audit event are written.',
  })
  @ApiCreatedResponse({ type: CustomerPoint })
  @ApiBadRequestResponse({ description: 'The campaign does not match the membership.' })
  @ApiNotFoundResponse({ description: 'Customer not found.' })
  @ApiBody({ type: PointsAdjustmentDto })
  async adjustCustomerPoints(
    @Param() params: IdParamDto,
    @Body() dto: PointsAdjustmentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CustomerPoint> {
    return this.superAdminService.adjustCustomerPoints(
      params.id,
      dto,
      actorId(req),
      clientIp(req),
    );
  }

  @Get('redemptions')
  @ApiOperation({ summary: 'List reward redemptions' })
  @ApiOkResponse({ type: PaginatedRedemptionsResponseDto })
  async listRedemptions(
    @Query() query: RedemptionListQueryDto,
  ): Promise<PaginatedRedemptionsResponseDto> {
    return this.superAdminService.listRedemptions(query) as unknown as Promise<PaginatedRedemptionsResponseDto>;
  }

  @Delete('codes/:id')
  @ApiOperation({
    summary: 'Revoke a generated point or reward code',
    description:
      'Looks the id up across staff point codes, merchant reward codes and customer numbers.',
  })
  @ApiOkResponse({ type: SuccessResponseDto })
  @ApiNotFoundResponse({ description: 'Code not found.' })
  async revokeCode(
    @Param() params: IdParamDto,
    @Body() dto: RevokeCodeDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ success: true }> {
    return this.superAdminService.revokeCode(
      params.id,
      actorId(req),
      clientIp(req),
      dto.reason,
    );
  }

  // -------------------------------------------------------------------------
  // Audit log
  // -------------------------------------------------------------------------

  @Get('audit-logs')
  @ApiOperation({
    summary: 'List super-admin audit events',
    description:
      'Paginated, newest first by default. Filters: actor, target type, target id and date range.',
  })
  @ApiOkResponse({ type: PaginatedAuditLogsResponseDto })
  async listAuditLogs(
    @Query() query: AuditLogListQueryDto,
  ): Promise<PaginatedAuditLogsResponseDto> {
    return this.superAdminService.listAuditLogs(query) as unknown as Promise<PaginatedAuditLogsResponseDto>;
  }
}

