import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { randomBytes } from 'crypto';

import { CacheService } from '../../core/cache/cache.service.js';
import { Role } from '../../core/enums/roles.js';
import { CampaignType } from '../../core/enums/campaignType.js';
import { SignupSource } from '../../core/enums/signupSource.js';
import { hashPassword } from '../../bcypt/bcrypt.js';

import { User } from '../user/entities/user.entity.js';
import { Business } from '../business/entities/business.entity.js';
import { Address } from '../business/entities/address.entity.js';
import { Social } from '../business/entities/socials.entity.js';
import { Link } from '../business/entities/link.entity.js';
import { Staff } from '../staff/entities/staff.entity.js';
import { Campaign } from '../campaign/entities/campaign.entity.js';
import { Customer } from '../customer/entities/customer.entity.js';
import { CustomerPoint } from '../reward/entities/customerPoints.entity.js';
import { CustomersReward } from '../reward/entities/customerRewards.entity.js';
import { CodeGeneratedByStaffs } from '../reward/entities/generateCode.entity.js';
import { GeneratedRewardCode } from '../reward/entities/generateRewardCode.entity.js';
import { RewardCustomerNumber } from '../reward/entities/rewardCustomerNumber.entity.js';
import { CustomerNumber } from '../reward/entities/customerNumber.entity.js';

import {
  SuperAdminAuditLog,
  SuperAdminAuditTargetType,
} from './entities/super-admin-audit-log.entity.js';

import type {
  AdminListQueryDto,
  CreateBusinessForUserDto,
  DeleteReasonDto,
  ResetPasswordDto,
  SetUserStatusDto,
  UpdateBusinessAdminDto,
  UpdateStaffAdminDto,
  UpdateUserAdminDto,
  UserListQueryDto,
} from './dto/user.dto.js';
import type { CreateUserDto } from '../user/dto/create-user.dto.js';
import type { BusinessListQueryDto } from './dto/business-query.dto.js';
import type {
  CampaignListQueryDto,
  SetCampaignStatusDto,
} from './dto/campaign.dto.js';
import type {
  CustomerListQueryDto,
  PointsAdjustmentDto,
} from './dto/customer.dto.js';
import type { RedemptionListQueryDto } from './dto/redemption-query.dto.js';
import type { AuditLogListQueryDto } from './dto/audit-log-query.dto.js';
import {
  CampaignCodeKind,
  type CampaignCodeListQueryDto,
  type CampaignCodeRowDto,
} from './dto/code-query.dto.js';
import type {
  ActivityPointResponseDto,
  CampaignAnalyticsResponseDto,
  CustomerMembershipResponseDto,
  CustomerProfileResponseDto,
  CustomerRowResponseDto,
  PlatformAnalyticsResponseDto,
  UserAnalyticsResponseDto,
  UserRowResponseDto,
} from './dto/response.dto.js';

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

interface CustomerRowInternal {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  created_at: Date;
  balance: number;
  campaignCount: number;
  memberships: CustomerMembershipResponseDto[];
}

const ANALYTICS_CACHE_PREFIX = 'analytics:';
const PLATFORM_ANALYTICS_TTL_MS = 60_000;
const DETAIL_ANALYTICS_TTL_MS = 30_000;

const PAGE_DEFAULT = 1;
const LIMIT_DEFAULT = 25;
const LIMIT_MAX = 100;

function pagination(query: { page?: number; limit?: number }): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.max(PAGE_DEFAULT, Number(query.page) || PAGE_DEFAULT);
  const limit = Math.min(
    LIMIT_MAX,
    Math.max(1, Number(query.limit) || LIMIT_DEFAULT),
  );
  return { page, limit, skip: (page - 1) * limit };
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

function asNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function lastDays(count: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    days.push(dateKey(day));
  }
  return days;
}

function parseDay(value: string | undefined, endOfDay: boolean): Date | undefined {
  if (!value) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`);
  }
  return new Date(value);
}

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Social)
    private readonly socialRepository: Repository<Social>,
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CustomerPoint)
    private readonly customerPointRepository: Repository<CustomerPoint>,
    @InjectRepository(CustomersReward)
    private readonly customerRewardRepository: Repository<CustomersReward>,
    @InjectRepository(CodeGeneratedByStaffs)
    private readonly generatedStaffCodeRepository: Repository<CodeGeneratedByStaffs>,
    @InjectRepository(GeneratedRewardCode)
    private readonly generatedRewardCodeRepository: Repository<GeneratedRewardCode>,
    @InjectRepository(RewardCustomerNumber)
    private readonly rewardCustomerNumberRepository: Repository<RewardCustomerNumber>,
    @InjectRepository(CustomerNumber)
    private readonly customerNumberRepository: Repository<CustomerNumber>,
    @InjectRepository(SuperAdminAuditLog)
    private readonly auditLogRepository: Repository<SuperAdminAuditLog>,
    private readonly cache: CacheService,
  ) {}

  // ---------------------------------------------------------------------------
  // Shared helpers
  // ---------------------------------------------------------------------------

  private clearAnalyticsCache(): void {
    this.cache.delByPrefix(ANALYTICS_CACHE_PREFIX);
  }

  private async recordAudit(
    actorId: string | undefined,
    action: string,
    targetType: SuperAdminAuditTargetType,
    targetId: string,
    payload: Record<string, unknown> | null,
    ip?: string,
  ): Promise<void> {
    const log = this.auditLogRepository.create({
      actor: actorId ? ({ id: actorId } as User) : null,
      action,
      targetType,
      targetId,
      payload: payload ?? null,
      ip: ip ?? null,
    });
    await this.auditLogRepository.save(log);
  }

  private sortExpression(
    allowed: Record<string, string>,
    sort: string | undefined,
    fallback: string,
  ): string {
    if (sort && allowed[sort]) return allowed[sort];
    return fallback;
  }

  private orderExpression<T>(
    queryBuilder: SelectQueryBuilder<T>,
    allowed: Record<string, string>,
    sort: string | undefined,
    order: 'ASC' | 'DESC' | undefined,
    fallback: string,
  ): void {
    queryBuilder.orderBy(
      this.sortExpression(allowed, sort, fallback),
      order === 'ASC' ? 'ASC' : 'DESC',
    );
  }

  private isCampaignEffectivelyActive(campaign: Campaign): boolean {
    if (campaign.isActive === false) return false;
    if (campaign.type !== CampaignType.SEASONAL) return true;
    if (!campaign.season) return false;
    const now = new Date();
    const start = new Date(campaign.season.startDate);
    const end = new Date(campaign.season.endDate);
    return now >= start && now <= end;
  }

  private async getOrThrowUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async getOrThrowBusiness(id: string): Promise<Business> {
    const business = await this.businessRepository.findOne({ where: { id } });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  private async getOrThrowCampaign(id: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: { season: true, business: true },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  private async assertEmailAvailable(
    email: string,
    currentId?: string,
  ): Promise<void> {
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing && existing.id !== currentId) {
      throw new ConflictException('Email address is already in use');
    }
  }

  private async assertPhoneAvailable(
    phoneNumber: string,
    currentId?: string,
  ): Promise<void> {
    const existing = await this.userRepository.findOne({
      where: { phoneNumber },
    });
    if (existing && existing.id !== currentId) {
      throw new ConflictException('Phone number is already in use');
    }
  }

  private async assertBusinessEmailAvailable(
    email: string,
    currentId?: string,
  ): Promise<void> {
    const existing = await this.businessRepository.findOne({
      where: { email },
    });
    if (existing && existing.id !== currentId) {
      throw new ConflictException('Business email address is already in use');
    }
  }

  private async assertBusinessPhoneAvailable(
    phoneNumber: string,
    currentId?: string,
  ): Promise<void> {
    const existing = await this.businessRepository.findOne({
      where: { phoneNumber },
    });
    if (existing && existing.id !== currentId) {
      throw new ConflictException('Business phone number is already in use');
    }
  }

  // ---------------------------------------------------------------------------
  // Users / admins
  // ---------------------------------------------------------------------------

  async listAdmins(
    query: AdminListQueryDto,
  ): Promise<Paginated<UserRowResponseDto>> {
    return this.listUsers(query as UserListQueryDto, Role.ADMIN);
  }

  async listUsers(
    query: UserListQueryDto,
    forcedRole?: Role,
  ): Promise<Paginated<UserRowResponseDto>> {
    const { page, limit, skip } = pagination(query);
    const queryBuilder = this.userRepository.createQueryBuilder('u');

    const role = forcedRole ?? query.role;
    if (role) queryBuilder.andWhere('u.role = :role', { role });
    if (query.signupSource) {
      queryBuilder.andWhere('u.signupSource = :signupSource', {
        signupSource: query.signupSource,
      });
    }
    if (query.isActive !== undefined) {
      queryBuilder.andWhere('u.isActive = :isActive', {
        isActive: query.isActive,
      });
    }
    if (query.createdFrom) {
      queryBuilder.andWhere('u.created_at >= :createdFrom', {
        createdFrom: parseDay(query.createdFrom, false),
      });
    }
    if (query.createdTo) {
      queryBuilder.andWhere('u.created_at <= :createdTo', {
        createdTo: parseDay(query.createdTo, true),
      });
    }
    if (query.search) {
      const search = `%${escapeLike(query.search)}%`;
      queryBuilder.andWhere(
        new Brackets((where) => {
          where
            .where('u.fullName ILIKE :search', { search })
            .orWhere('u.email ILIKE :search', { search })
            .orWhere('u.phoneNumber ILIKE :search', { search });
        }),
      );
    }

    this.orderExpression(
      queryBuilder,
      {
        fullName: 'u.fullName',
        email: 'u.email',
        phoneNumber: 'u.phoneNumber',
        role: 'u.role',
        signupSource: 'u.signupSource',
        isActive: 'u.isActive',
        created_at: 'u.created_at',
        businessCount:
          '(SELECT COUNT(*) FROM "Business" b WHERE b."userId" = u.id)',
        campaignCount:
          '(SELECT COUNT(*) FROM "Campaign" c JOIN "Business" b ON c."businessId" = b.id WHERE b."userId" = u.id)',
        customerCount:
          '(SELECT COUNT(*) FROM "Customers" ct JOIN "Campaign" c ON ct."campaignId" = c.id JOIN "Business" b ON c."businessId" = b.id WHERE b."userId" = u.id)',
      },
      query.sort,
      query.order,
      'u.created_at',
    );

    queryBuilder.skip(skip).take(limit);
    const [users, total] = await queryBuilder.getManyAndCount();
    await this.attachUserCounts(users);

    return { data: users as UserRowResponseDto[], total, page, limit };
  }

  private async attachUserCounts(users: User[]): Promise<void> {
    if (!users.length) return;
    const ids = users.map((user) => user.id);

    const [businessRows, campaignRows, customerRows] = await Promise.all([
      this.businessRepository.query(
        `SELECT "userId", COUNT(*)::int AS "count"
         FROM "Business"
         WHERE "userId" = ANY($1::uuid[])
         GROUP BY "userId"`,
        [ids],
      ),
      this.campaignRepository.query(
        `SELECT b."userId", COUNT(c.id)::int AS "count"
         FROM "Campaign" c
         JOIN "Business" b ON c."businessId" = b.id
         WHERE b."userId" = ANY($1::uuid[])
         GROUP BY b."userId"`,
        [ids],
      ),
      this.customerRepository.query(
        `SELECT b."userId", COUNT(ct.id)::int AS "count"
         FROM "Customers" ct
         JOIN "Campaign" c ON ct."campaignId" = c.id
         JOIN "Business" b ON c."businessId" = b.id
         WHERE b."userId" = ANY($1::uuid[])
         GROUP BY b."userId"`,
        [ids],
      ),
    ]);

    const businessCounts = new Map<string, number>();
    for (const row of businessRows) {
      businessCounts.set(row.userId, asNumber(row.count));
    }
    const campaignCounts = new Map<string, number>();
    for (const row of campaignRows) {
      campaignCounts.set(row.userId, asNumber(row.count));
    }
    const customerCounts = new Map<string, number>();
    for (const row of customerRows) {
      customerCounts.set(row.userId, asNumber(row.count));
    }

    for (const user of users as UserRowResponseDto[]) {
      user.businessCount = businessCounts.get(user.id) ?? 0;
      user.campaignCount = campaignCounts.get(user.id) ?? 0;
      user.customerCount = customerCounts.get(user.id) ?? 0;
    }
  }

  async createUser(
    dto: CreateUserDto,
    actorId?: string,
    ip?: string,
  ): Promise<User> {
    await this.assertEmailAvailable(dto.email);
    await this.assertPhoneAvailable(dto.phoneNumber);

    const user = this.userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      location: dto.location ?? null,
      referralCode: dto.referralCode ?? null,
      signupSource: dto.signupSource ?? SignupSource.MCOM,
      role: dto.role ?? Role.ADMIN,
      isActive: true,
      password: await hashPassword(dto.password ?? 'mypassword'),
    });
    const saved = await this.userRepository.save(user);

    await this.recordAudit(
      actorId,
      'user.created',
      SuperAdminAuditTargetType.USER,
      saved.id,
      {
        email: saved.email,
        role: saved.role,
        note: 'Account created',
      },
      ip,
    );
    this.clearAnalyticsCache();
    return saved;
  }

  async getUser(id: string): Promise<User & { businesses: Business[] }> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { businesses: true },
    });
    if (!user) throw new NotFoundException('User not found');
    user.businesses = [...(user.businesses ?? [])].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    return user;
  }

  async updateUser(
    id: string,
    dto: UpdateUserAdminDto,
    actorId?: string,
    ip?: string,
  ): Promise<User> {
    const user = await this.getOrThrowUser(id);
    if (dto.email && dto.email !== user.email) {
      await this.assertEmailAvailable(dto.email, id);
    }
    if (dto.phoneNumber && dto.phoneNumber !== user.phoneNumber) {
      await this.assertPhoneAvailable(dto.phoneNumber, id);
    }

    Object.assign(user, dto);
    await this.userRepository.save(user);
    await this.recordAudit(
      actorId,
      'user.updated',
      SuperAdminAuditTargetType.USER,
      id,
      { ...dto, note: 'Account details updated' },
      ip,
    );
    this.clearAnalyticsCache();
    return user;
  }

  async setUserStatus(
    id: string,
    dto: SetUserStatusDto,
    actorId?: string,
    ip?: string,
  ): Promise<User> {
    const user = await this.getOrThrowUser(id);
    if (actorId === id && dto.isActive === false) {
      throw new BadRequestException('You cannot deactivate your own account');
    }

    user.isActive = dto.isActive;
    await this.userRepository.save(user);

    const note = dto.reason ?? 'Status updated';
    await this.recordAudit(
      actorId,
      'user.status_changed',
      SuperAdminAuditTargetType.USER,
      id,
      { isActive: dto.isActive, reason: dto.reason ?? null, note },
      ip,
    );
    this.clearAnalyticsCache();
    return user;
  }

  async resetPassword(
    id: string,
    dto: ResetPasswordDto,
    actorId?: string,
    ip?: string,
  ): Promise<{ temporaryPassword: string }> {
    const user = await this.getOrThrowUser(id);
    const temporaryPassword = `GBS-${randomBytes(4).toString('hex').toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`;
    user.password = await hashPassword(temporaryPassword);
    await this.userRepository.save(user);

    await this.recordAudit(
      actorId,
      'user.password_reset',
      SuperAdminAuditTargetType.USER,
      id,
      { reason: dto.reason, note: dto.reason },
      ip,
    );
    return { temporaryPassword };
  }

  async deleteUser(
    id: string,
    dto: DeleteReasonDto,
    actorId?: string,
    ip?: string,
  ): Promise<{ success: true }> {
    const user = await this.getOrThrowUser(id);
    if (actorId === id) {
      throw new BadRequestException('You cannot delete your own account');
    }

    // Businesses must go first: Business.userId has no cascade on delete.
    await this.businessRepository.query(
      'DELETE FROM "Business" WHERE "userId" = $1',
      [id],
    );
    await this.userRepository.delete(id);

    await this.recordAudit(
      actorId,
      'user.deleted',
      SuperAdminAuditTargetType.USER,
      id,
      { email: user.email, reason: dto.reason, note: dto.reason },
      ip,
    );
    this.clearAnalyticsCache();
    return { success: true };
  }

  async getAdminBusinesses(id: string): Promise<Business[]> {
    await this.getOrThrowUser(id);
    return this.businessRepository.find({
      where: { user: { id } },
      relations: { address: true, socials: true, links: true },
      order: { created_at: 'DESC' },
    });
  }

  async createBusinessForUser(
    userId: string,
    dto: CreateBusinessForUserDto,
    actorId?: string,
    ip?: string,
  ): Promise<Business> {
    const owner = await this.getOrThrowUser(userId);
    await this.assertBusinessEmailAvailable(dto.email);
    await this.assertBusinessPhoneAvailable(dto.phoneNumber);

    const {
      address: addressDto,
      socials: socialsDto,
      links: linksDto,
      ...scalarFields
    } = dto;

    const address = addressDto
      ? await this.addressRepository.save(
          this.addressRepository.create({
            street: '',
            postalCode: '',
            city: '',
            state: '',
            ...addressDto,
          }),
        )
      : null;
    const socials = socialsDto
      ? await this.socialRepository.save(this.socialRepository.create(socialsDto))
      : null;

    const business = this.businessRepository.create({
      ...scalarFields,
      user: owner,
      address,
      socials,
    });
    const saved = await this.businessRepository.save(business);

    if (linksDto?.length) {
      const links = await this.linkRepository.save(
        linksDto.map((link) =>
          this.linkRepository.create({ ...link, business: saved }),
        ),
      );
      // Avoid serializing the business -> links -> business cycle.
      for (const link of links) delete (link as { business?: Business }).business;
      saved.links = links;
    }

    await this.recordAudit(
      actorId,
      'business.created',
      SuperAdminAuditTargetType.BUSINESS,
      saved.id,
      { name: saved.name, ownerId: owner.id, note: 'Business created' },
      ip,
    );
    this.clearAnalyticsCache();
    return saved;
  }

  // ---------------------------------------------------------------------------
  // Businesses / staff
  // ---------------------------------------------------------------------------

  async listBusinesses(
    query: BusinessListQueryDto,
  ): Promise<Paginated<Business>> {
    const { page, limit, skip } = pagination(query);
    const queryBuilder = this.businessRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.user', 'owner')
      .leftJoin('b.campaigns', 'campaign')
      .addSelect(['campaign.id']);

    if (query.userId) {
      queryBuilder.andWhere('owner.id = :userId', { userId: query.userId });
    }
    if (query.search) {
      const search = `%${escapeLike(query.search)}%`;
      queryBuilder.andWhere(
        new Brackets((where) => {
          where
            .where('b.name ILIKE :search', { search })
            .orWhere('b.email ILIKE :search', { search })
            .orWhere('b.phoneNumber ILIKE :search', { search })
            .orWhere('owner.fullName ILIKE :search', { search })
            .orWhere('owner.email ILIKE :search', { search });
        }),
      );
    }

    this.orderExpression(
      queryBuilder,
      {
        name: 'b.name',
        email: 'b.email',
        phoneNumber: 'b.phoneNumber',
        created_at: 'b.created_at',
      },
      query.sort,
      query.order,
      'b.created_at',
    );

    queryBuilder.skip(skip).take(limit);
    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total, page, limit };
  }

  async getBusiness(id: string): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: {
        user: true,
        address: true,
        socials: true,
        links: true,
        campaigns: { season: true },
        staffs: true,
        segments: true,
        seasons: true,
      },
    });
    if (!business) throw new NotFoundException('Business not found');

    business.campaigns = [...(business.campaigns ?? [])].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    for (const campaign of business.campaigns) {
      campaign.isActive = this.isCampaignEffectivelyActive(campaign);
    }
    business.staffs = [...(business.staffs ?? [])].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    business.segments = [...(business.segments ?? [])].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    business.seasons = [...(business.seasons ?? [])].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );
    return business;
  }

  async updateBusiness(
    id: string,
    dto: UpdateBusinessAdminDto,
    actorId?: string,
    ip?: string,
  ): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: { address: true, socials: true, links: true },
    });
    if (!business) throw new NotFoundException('Business not found');

    if (dto.email && dto.email !== business.email) {
      await this.assertBusinessEmailAvailable(dto.email, id);
    }
    if (dto.phoneNumber && dto.phoneNumber !== business.phoneNumber) {
      await this.assertBusinessPhoneAvailable(dto.phoneNumber, id);
    }

    const {
      address: addressDto,
      socials: socialsDto,
      links: linksDto,
      ...scalarFields
    } = dto;

    if (addressDto) {
      if (business.address) {
        Object.assign(business.address, addressDto);
        await this.addressRepository.save(business.address);
      } else {
        business.address = await this.addressRepository.save(
          this.addressRepository.create({
            street: '',
            postalCode: '',
            city: '',
            state: '',
            ...addressDto,
          }),
        );
      }
    }

    if (socialsDto) {
      if (business.socials) {
        Object.assign(business.socials, socialsDto);
        await this.socialRepository.save(business.socials);
      } else {
        business.socials = await this.socialRepository.save(
          this.socialRepository.create(socialsDto),
        );
      }
    }

    if (linksDto) {
      await this.linkRepository.query(
        'DELETE FROM "Links" WHERE "businessId" = $1',
        [id],
      );
      const links = await this.linkRepository.save(
        linksDto.map((link) =>
          this.linkRepository.create({ ...link, business }),
        ),
      );
      // Avoid serializing the business -> links -> business cycle.
      for (const link of links) delete (link as { business?: Business }).business;
      business.links = links;
    }

    Object.assign(business, scalarFields);
    const saved = await this.businessRepository.save(business);

    await this.recordAudit(
      actorId,
      'business.updated',
      SuperAdminAuditTargetType.BUSINESS,
      id,
      { ...scalarFields, note: 'Business details updated' },
      ip,
    );
    this.clearAnalyticsCache();
    return saved;
  }

  async deleteBusiness(
    id: string,
    dto: DeleteReasonDto,
    actorId?: string,
    ip?: string,
  ): Promise<{ success: true }> {
    const business = await this.getOrThrowBusiness(id);
    await this.businessRepository.delete(id);

    await this.recordAudit(
      actorId,
      'business.deleted',
      SuperAdminAuditTargetType.BUSINESS,
      id,
      {
        name: business.name,
        reason: dto.reason,
        note: dto.reason,
      },
      ip,
    );
    this.clearAnalyticsCache();
    return { success: true };
  }

  async businessStaff(id: string): Promise<Staff[]> {
    await this.getOrThrowBusiness(id);
    return this.staffRepository.find({
      where: { business: { id } },
      order: { created_at: 'DESC' },
    });
  }

  async updateStaff(
    id: string,
    dto: UpdateStaffAdminDto,
    actorId?: string,
    ip?: string,
  ): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: { business: true },
    });
    if (!staff) throw new NotFoundException('Staff member not found');

    if (dto.email && dto.email !== staff.email) {
      const existing = await this.staffRepository.findOne({
        where: { email: dto.email },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Staff email address is already in use');
      }
    }

    Object.assign(staff, dto);
    await this.staffRepository.save(staff);

    await this.recordAudit(
      actorId,
      'staff.updated',
      SuperAdminAuditTargetType.STAFF,
      id,
      {
        businessId: staff.business?.id ?? null,
        changes: dto,
        note: 'Staff member updated',
      },
      ip,
    );
    return staff;
  }

  // ---------------------------------------------------------------------------
  // Campaigns
  // ---------------------------------------------------------------------------

  async listCampaigns(
    query: CampaignListQueryDto,
  ): Promise<Paginated<Campaign>> {
    const { page, limit, skip } = pagination(query);
    const queryBuilder = this.campaignRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.business', 'business')
      .leftJoinAndSelect('business.user', 'owner')
      .leftJoinAndSelect('c.season', 'season');

    if (query.businessId) {
      queryBuilder.andWhere('business.id = :businessId', {
        businessId: query.businessId,
      });
    }
    if (query.userId) {
      queryBuilder.andWhere('owner.id = :userId', { userId: query.userId });
    }
    if (query.type) {
      queryBuilder.andWhere('c.type = :type', { type: query.type });
    }

    const effectiveActive = `(c."isActive" = true AND (c."type" <> 'SEASONAL' OR (season."startDate" IS NOT NULL AND CURRENT_TIMESTAMP BETWEEN season."startDate" AND season."endDate")))`;
    if (query.active !== undefined) {
      queryBuilder.andWhere(
        query.active ? effectiveActive : `NOT ${effectiveActive}`,
      );
    }

    if (query.search) {
      const search = `%${escapeLike(query.search)}%`;
      queryBuilder.andWhere(
        new Brackets((where) => {
          where
            .where('c.name ILIKE :search', { search })
            .orWhere('c.uniqueCode ILIKE :search', { search })
            .orWhere('business.name ILIKE :search', { search })
            .orWhere('owner.fullName ILIKE :search', { search });
        }),
      );
    }

    this.orderExpression(
      queryBuilder,
      {
        name: 'c.name',
        type: 'c.type',
        uniqueCode: 'c.uniqueCode',
        isActive: effectiveActive,
        created_at: 'c.created_at',
      },
      query.sort,
      query.order,
      'c.created_at',
    );

    queryBuilder.skip(skip).take(limit);
    const [data, total] = await queryBuilder.getManyAndCount();
    for (const campaign of data) {
      campaign.isActive = this.isCampaignEffectivelyActive(campaign);
    }
    return { data, total, page, limit };
  }

  async getCampaign(id: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: {
        business: { user: true },
        rewards: true,
        season: true,
      },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    campaign.rewards = [...(campaign.rewards ?? [])].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    campaign.isActive = this.isCampaignEffectivelyActive(campaign);
    return campaign;
  }

  async setCampaignStatus(
    id: string,
    dto: SetCampaignStatusDto,
    actorId?: string,
    ip?: string,
  ): Promise<Campaign> {
    const campaign = await this.getOrThrowCampaign(id);
    campaign.isActive = dto.isActive;
    await this.campaignRepository.save(campaign);

    const note = dto.reason ?? 'Campaign status updated';
    await this.recordAudit(
      actorId,
      'campaign.status_changed',
      SuperAdminAuditTargetType.CAMPAIGN,
      id,
      { isActive: dto.isActive, reason: dto.reason ?? null, note },
      ip,
    );
    this.clearAnalyticsCache();

    campaign.isActive = this.isCampaignEffectivelyActive(campaign);
    return campaign;
  }

  // ---------------------------------------------------------------------------
  // Analytics
  // ---------------------------------------------------------------------------

  async getPlatformAnalytics(
    from?: string,
    to?: string,
  ): Promise<PlatformAnalyticsResponseDto> {
    const cacheKey = `${ANALYTICS_CACHE_PREFIX}platform:${from ?? ''}:${to ?? ''}`;
    return this.cache.getOrSet(cacheKey, PLATFORM_ANALYTICS_TTL_MS, async () => {
      const toDate = parseDay(to, true) ?? new Date();
      const fromDate =
        parseDay(from, false) ??
        new Date(toDate.getTime() - 29 * 24 * 60 * 60 * 1000);
      const start = fromDate <= toDate ? fromDate : toDate;
      const end = fromDate <= toDate ? toDate : fromDate;

      const roleRows: Array<{ role: string; count: number }> =
        await this.userRepository.query(
          `SELECT role, COUNT(*)::int AS "count" FROM "Users" GROUP BY role`,
        );
      const signupRows: Array<{ signupSource: string; count: number }> =
        await this.userRepository.query(
          `SELECT "signupSource", COUNT(*)::int AS "count" FROM "Users" GROUP BY "signupSource"`,
        );
      const [businessCountRows, campaignCountRows, activeCampaignRows, customerCountRows] =
        await Promise.all([
          this.businessRepository.query(
            `SELECT COUNT(*)::int AS "count" FROM "Business"`,
          ),
          this.campaignRepository.query(
            `SELECT COUNT(*)::int AS "count" FROM "Campaign"`,
          ),
          this.campaignRepository.query(
            `SELECT COUNT(*)::int AS "count"
             FROM "Campaign" c
             LEFT JOIN "Season" s ON c."seasonId" = s.id
             WHERE c."isActive" = true
               AND (c."type" <> 'SEASONAL' OR (s."startDate" IS NOT NULL AND CURRENT_TIMESTAMP BETWEEN s."startDate" AND s."endDate"))`,
          ),
          this.customerRepository.query(
            `SELECT COUNT(*)::int AS "count" FROM "Customers"`,
          ),
        ]);

      const [issuedRows, redeemedRows, redemptionCountRows] = await Promise.all([
        this.customerPointRepository.query(
          `SELECT COALESCE(SUM(points), 0)::int AS "total"
           FROM "Customer points" WHERE points > 0`,
        ),
        this.customerRewardRepository.query(
          `SELECT COALESCE(SUM(CAST(r."pointCost" AS INTEGER)), 0)::int AS "total"
           FROM "CustomersRewards" cr
           JOIN "Rewards" r ON cr."rewardId" = r.id`,
        ),
        this.customerRewardRepository.query(
          `SELECT COUNT(*)::int AS "count" FROM "CustomersRewards"`,
        ),
      ]);

      const usersByRole: Record<string, number> = {
        [Role.SUPER_ADMIN]: 0,
        [Role.ADMIN]: 0,
        [Role.STAFF]: 0,
        [Role.CUSTOMER]: 0,
      };
      for (const row of roleRows) usersByRole[row.role] = asNumber(row.count);

      const usersBySignupSource: Record<string, number> = {
        [SignupSource.MCOM]: 0,
        [SignupSource.STOCK_AUDIT]: 0,
      };
      for (const row of signupRows) {
        usersBySignupSource[row.signupSource] = asNumber(row.count);
      }

      const [newUserRows, newCustomerRows, pointsRows, redemptionRows] =
        await Promise.all([
          this.userRepository.query(
            `SELECT to_char("created_at"::date, 'YYYY-MM-DD') AS "date", COUNT(*)::int AS "count"
             FROM "Users" WHERE "created_at" BETWEEN $1 AND $2 GROUP BY "created_at"::date`,
            [start, end],
          ),
          this.customerRepository.query(
            `SELECT to_char("created_at"::date, 'YYYY-MM-DD') AS "date", COUNT(*)::int AS "count"
             FROM "Customers" WHERE "created_at" BETWEEN $1 AND $2 GROUP BY "created_at"::date`,
            [start, end],
          ),
          this.customerPointRepository.query(
            `SELECT to_char("created_at"::date, 'YYYY-MM-DD') AS "date", COALESCE(SUM(points), 0)::int AS "count"
             FROM "Customer points"
             WHERE points > 0 AND "created_at" BETWEEN $1 AND $2
             GROUP BY "created_at"::date`,
            [start, end],
          ),
          this.customerRewardRepository.query(
            `SELECT to_char("created_at"::date, 'YYYY-MM-DD') AS "date", COUNT(*)::int AS "count"
             FROM "CustomersRewards" WHERE "created_at" BETWEEN $1 AND $2 GROUP BY "created_at"::date`,
            [start, end],
          ),
        ]);

      const mapCounts = (
        rows: Array<{ date: string; count: number }>,
      ): Map<string, number> => {
        const map = new Map<string, number>();
        for (const row of rows) map.set(row.date, asNumber(row.count));
        return map;
      };
      const newUsers = mapCounts(newUserRows);
      const newCustomers = mapCounts(newCustomerRows);
      const pointsIssued = mapCounts(pointsRows);
      const redemptions = mapCounts(redemptionRows);

      const series: PlatformAnalyticsResponseDto['series'] = [];
      const cursor = new Date(
        Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()),
      );
      const last = new Date(
        Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()),
      );
      while (cursor <= last) {
        const key = cursor.toISOString().slice(0, 10);
        series.push({
          date: key,
          newUsers: newUsers.get(key) ?? 0,
          newCustomers: newCustomers.get(key) ?? 0,
          pointsIssued: pointsIssued.get(key) ?? 0,
          redemptions: redemptions.get(key) ?? 0,
        });
        cursor.setUTCDate(cursor.getUTCDate() + 1);
      }

      const topBusinesses: PlatformAnalyticsResponseDto['topBusinesses'] =
        await this.businessRepository.query(
          `SELECT b.id AS "businessId",
                  b.name AS "name",
                  COALESCE(u."fullName", '—') AS "ownerName",
                  COALESCE((
                    SELECT COUNT(*)::int
                    FROM "Customers" ct
                    JOIN "Campaign" ca ON ct."campaignId" = ca.id
                    WHERE ca."businessId" = b.id
                  ), 0)::int AS "customers",
                  COALESCE((
                    SELECT SUM(p.points)::int
                    FROM "Customer points" p
                    JOIN "Campaign" ca ON p."campaignId" = ca.id
                    WHERE ca."businessId" = b.id AND p.points > 0
                  ), 0)::int AS "pointsIssued"
           FROM "Business" b
           LEFT JOIN "Users" u ON b."userId" = u.id
           ORDER BY "pointsIssued" DESC NULLS LAST, b.name ASC
           LIMIT 5`,
        );

      return {
        totals: {
          users: roleRows.reduce((sum, row) => sum + asNumber(row.count), 0),
          usersByRole,
          usersBySignupSource,
          businesses: asNumber(businessCountRows[0]?.count),
          campaigns: asNumber(campaignCountRows[0]?.count),
          activeCampaigns: asNumber(activeCampaignRows[0]?.count),
          customers: asNumber(customerCountRows[0]?.count),
          pointsIssued: asNumber(issuedRows[0]?.total),
          pointsRedeemed: asNumber(redeemedRows[0]?.total),
          rewardsRedeemed: asNumber(redemptionCountRows[0]?.count),
        },
        series,
        topBusinesses,
      };
    });
  }

  async getUserAnalytics(id: string): Promise<UserAnalyticsResponseDto> {
    const cacheKey = `${ANALYTICS_CACHE_PREFIX}user:${id}`;
    return this.cache.getOrSet(cacheKey, DETAIL_ANALYTICS_TTL_MS, async () => {
      await this.getOrThrowUser(id);
      const campaigns = await this.campaignRepository.find({
        where: { business: { user: { id } } },
        relations: { season: true },
      });
      return this.campaignFootprint(campaigns);
    });
  }

  async getBusinessAnalytics(id: string): Promise<UserAnalyticsResponseDto> {
    const cacheKey = `${ANALYTICS_CACHE_PREFIX}business:${id}`;
    return this.cache.getOrSet(cacheKey, DETAIL_ANALYTICS_TTL_MS, async () => {
      await this.getOrThrowBusiness(id);
      const campaigns = await this.campaignRepository.find({
        where: { business: { id } },
        relations: { season: true },
      });
      return this.campaignFootprint(campaigns);
    });
  }

  /** Campaign, customer, points and redemption totals across a set of campaigns. */
  private async campaignFootprint(
    campaigns: Campaign[],
  ): Promise<UserAnalyticsResponseDto> {
    const campaignIds = campaigns.map((campaign) => campaign.id);
    const activeCampaigns = campaigns.filter((campaign) =>
      this.isCampaignEffectivelyActive(campaign),
    ).length;

    let totalCustomers = 0;
    let totalPointsIssued = 0;
    let totalRewardsRedeemed = 0;

    if (campaignIds.length) {
      const [customerRows, issuedRows, redemptionRows] = await Promise.all([
        this.customerRepository.query(
          `SELECT COUNT(*)::int AS "count" FROM "Customers" WHERE "campaignId" = ANY($1::uuid[])`,
          [campaignIds],
        ),
        this.customerPointRepository.query(
          `SELECT COALESCE(SUM(points), 0)::int AS "total" FROM "Customer points" WHERE "campaignId" = ANY($1::uuid[]) AND points > 0`,
          [campaignIds],
        ),
        this.customerRewardRepository.query(
          `SELECT COUNT(*)::int AS "count" FROM "CustomersRewards" WHERE "campaignId" = ANY($1::uuid[])`,
          [campaignIds],
        ),
      ]);
      totalCustomers = asNumber(customerRows[0]?.count);
      totalPointsIssued = asNumber(issuedRows[0]?.total);
      totalRewardsRedeemed = asNumber(redemptionRows[0]?.count);
    }

    return {
      totalCampaigns: campaigns.length,
      activeCampaigns,
      inactiveCampaigns: campaigns.length - activeCampaigns,
      totalCustomers,
      totalPointsIssued,
      totalRewardsRedeemed,
    };
  }

  async getCampaignAnalytics(id: string): Promise<CampaignAnalyticsResponseDto> {
    const cacheKey = `${ANALYTICS_CACHE_PREFIX}campaign:${id}`;
    return this.cache.getOrSet(cacheKey, DETAIL_ANALYTICS_TTL_MS, async () => {
      const campaign = await this.getOrThrowCampaign(id);

      const [customerRows, issuedRows, redemptionRows, pointsActivityRows, rewardActivityRows] =
        await Promise.all([
          this.customerRepository.query(
            `SELECT COUNT(*)::int AS "count" FROM "Customers" WHERE "campaignId" = $1`,
            [id],
          ),
          this.customerPointRepository.query(
            `SELECT COALESCE(SUM(points), 0)::int AS "total" FROM "Customer points" WHERE "campaignId" = $1 AND points > 0`,
            [id],
          ),
          this.customerRewardRepository.query(
            `SELECT COUNT(*)::int AS "count" FROM "CustomersRewards" WHERE "campaignId" = $1`,
            [id],
          ),
          this.customerPointRepository.query(
            `SELECT to_char("created_at"::date, 'YYYY-MM-DD') AS "date", COUNT(*)::int AS "count"
             FROM "Customer points"
             WHERE "campaignId" = $1 AND points > 0
               AND "created_at" >= CURRENT_DATE - INTERVAL '6 days'
               AND "created_at" < CURRENT_DATE + INTERVAL '1 day'
             GROUP BY "created_at"::date`,
            [id],
          ),
          this.customerRewardRepository.query(
            `SELECT to_char("created_at"::date, 'YYYY-MM-DD') AS "date", COUNT(*)::int AS "count"
             FROM "CustomersRewards"
             WHERE "campaignId" = $1
               AND "created_at" >= CURRENT_DATE - INTERVAL '6 days'
               AND "created_at" < CURRENT_DATE + INTERVAL '1 day'
             GROUP BY "created_at"::date`,
            [id],
          ),
        ]);

      const days = lastDays(7);
      const pointsMap = new Map<string, number>();
      for (const row of pointsActivityRows) {
        pointsMap.set(row.date, asNumber(row.count));
      }
      const rewardsMap = new Map<string, number>();
      for (const row of rewardActivityRows) {
        rewardsMap.set(row.date, asNumber(row.count));
      }

      const pointsActivity: ActivityPointResponseDto[] = days.map((date) => ({
        date,
        count: pointsMap.get(date) ?? 0,
      }));
      const rewardsActivity: ActivityPointResponseDto[] = days.map((date) => ({
        date,
        count: rewardsMap.get(date) ?? 0,
      }));

      return {
        campaignName: campaign.name,
        isActive: this.isCampaignEffectivelyActive(campaign),
        totalCustomers: asNumber(customerRows[0]?.count),
        totalPointsIssued: asNumber(issuedRows[0]?.total),
        totalRewardsRedeemed: asNumber(redemptionRows[0]?.count),
        pointsActivity,
        rewardsActivity,
      };
    });
  }

  // ---------------------------------------------------------------------------
  // Customers
  // ---------------------------------------------------------------------------

  private async membershipBalances(
    customerIds: string[],
  ): Promise<Map<string, number>> {
    const balances = new Map<string, number>();
    if (!customerIds.length) return balances;

    const [pointRows, rewardRows] = await Promise.all([
      this.customerPointRepository.query(
        `SELECT "customerId", COALESCE(SUM(points), 0)::int AS "total"
         FROM "Customer points"
         WHERE "customerId" = ANY($1::uuid[])
         GROUP BY "customerId"`,
        [customerIds],
      ),
      this.customerRewardRepository.query(
        `SELECT cr."customerId", COALESCE(SUM(CAST(r."pointCost" AS INTEGER)), 0)::int AS "total"
         FROM "CustomersRewards" cr
         JOIN "Rewards" r ON cr."rewardId" = r.id
         WHERE cr."customerId" = ANY($1::uuid[])
         GROUP BY cr."customerId"`,
        [customerIds],
      ),
    ]);

    for (const id of customerIds) balances.set(id, 0);
    for (const row of pointRows) {
      balances.set(row.customerId, asNumber(row.total));
    }
    for (const row of rewardRows) {
      balances.set(
        row.customerId,
        (balances.get(row.customerId) ?? 0) - asNumber(row.total),
      );
    }
    return balances;
  }

  private groupCustomers(
    customers: Customer[],
    balances: Map<string, number>,
  ): CustomerRowInternal[] {
    const groups = new Map<string, Customer[]>();
    for (const customer of customers) {
      const key = customer.email.toLocaleLowerCase();
      const list = groups.get(key);
      if (list) list.push(customer);
      else groups.set(key, [customer]);
    }

    const people: CustomerRowInternal[] = [];
    for (const memberships of groups.values()) {
      const newestFirst = [...memberships].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      const latest = newestFirst[0];
      const oldest = newestFirst[newestFirst.length - 1];
      const membershipRows: CustomerMembershipResponseDto[] = newestFirst.map(
        (membership) => ({
          id: membership.id,
          created_at: membership.created_at,
          balance: balances.get(membership.id) ?? 0,
          campaign: membership.campaign,
        }),
      );

      people.push({
        id: oldest.id,
        firstName: latest.firstName,
        lastName: latest.lastName,
        email: latest.email,
        created_at: oldest.created_at,
        balance: membershipRows.reduce((sum, item) => sum + item.balance, 0),
        campaignCount: membershipRows.length,
        memberships: membershipRows,
      });
    }
    return people;
  }

  async listCustomers(
    query: CustomerListQueryDto,
  ): Promise<Paginated<CustomerRowResponseDto>> {
    const { page, limit, skip } = pagination(query);
    const queryBuilder = this.customerRepository
      .createQueryBuilder('customer')
      .innerJoinAndSelect('customer.campaign', 'campaign')
      .leftJoinAndSelect('campaign.business', 'business')
      .leftJoinAndSelect('business.user', 'owner');

    if (query.campaignId) {
      queryBuilder.andWhere('campaign.id = :campaignId', {
        campaignId: query.campaignId,
      });
    }
    if (query.businessId) {
      queryBuilder.andWhere('business.id = :businessId', {
        businessId: query.businessId,
      });
    }
    if (query.search) {
      const search = `%${escapeLike(query.search)}%`;
      queryBuilder.andWhere(
        new Brackets((where) => {
          where
            .where('customer.firstName ILIKE :search', { search })
            .orWhere('customer.lastName ILIKE :search', { search })
            .orWhere('customer.email ILIKE :search', { search });
        }),
      );
    }

    const customers = await queryBuilder.getMany();
    const balances = await this.membershipBalances(
      customers.map((customer) => customer.id),
    );
    const people = this.groupCustomers(customers, balances);

    const sort = query.sort ?? 'created_at';
    const direction = query.order === 'ASC' ? 1 : -1;
    people.sort((a, b) => {
      let left: string | number;
      let right: string | number;
      switch (sort) {
        case 'firstName':
          left = `${a.firstName} ${a.lastName}`.toLowerCase();
          right = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'email':
          left = a.email.toLowerCase();
          right = b.email.toLowerCase();
          break;
        case 'campaignCount':
          left = a.campaignCount;
          right = b.campaignCount;
          break;
        case 'balance':
          left = a.balance;
          right = b.balance;
          break;
        case 'name':
          left = `${a.firstName} ${a.lastName}`.toLowerCase();
          right = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'created_at':
        default:
          left = new Date(a.created_at).getTime();
          right = new Date(b.created_at).getTime();
          break;
      }
      if (left < right) return -1 * direction;
      if (left > right) return 1 * direction;
      return 0;
    });

    return {
      data: people.slice(skip, skip + limit) as CustomerRowResponseDto[],
      total: people.length,
      page,
      limit,
    };
  }

  async getCustomer(id: string): Promise<CustomerProfileResponseDto> {
    const membership = await this.customerRepository.findOne({
      where: { id },
      relations: { campaign: { business: { user: true } } },
    });
    if (!membership) throw new NotFoundException('Customer not found');

    const memberships = await this.customerRepository
      .createQueryBuilder('customer')
      .innerJoinAndSelect('customer.campaign', 'campaign')
      .leftJoinAndSelect('campaign.business', 'business')
      .leftJoinAndSelect('business.user', 'owner')
      .where('lower(customer.email) = :email', {
        email: membership.email.toLocaleLowerCase(),
      })
      .getMany();

    const ids = memberships.map((row) => row.id);
    const balances = await this.membershipBalances(ids);
    const person = this.groupCustomers(memberships, balances)[0];
    if (!person) throw new NotFoundException('Customer not found');

    if (!ids.length) {
      return { ...person, ledger: [], redemptions: [] } as CustomerProfileResponseDto;
    }

    const [ledger, redemptions] = await Promise.all([
      this.customerPointRepository
        .createQueryBuilder('point')
        .leftJoinAndSelect('point.campaign', 'campaign')
        .leftJoinAndSelect('campaign.business', 'business')
        .where('point.customerId IN (:...ids)', { ids })
        .orderBy('point.created_at', 'DESC')
        .getMany(),
      this.customerRewardRepository
        .createQueryBuilder('redemption')
        .leftJoinAndSelect('redemption.reward', 'reward')
        .leftJoinAndSelect('redemption.campaign', 'campaign')
        .leftJoinAndSelect('campaign.business', 'business')
        .leftJoinAndSelect('redemption.customer', 'customer')
        .where('redemption.customerId IN (:...ids)', { ids })
        .orderBy('redemption.created_at', 'DESC')
        .getMany(),
    ]);

    return {
      ...person,
      ledger,
      redemptions,
    } as CustomerProfileResponseDto;
  }

  async adjustCustomerPoints(
    membershipId: string,
    dto: PointsAdjustmentDto,
    actorId?: string,
    ip?: string,
  ): Promise<CustomerPoint> {
    const membership = await this.customerRepository.findOne({
      where: { id: membershipId },
      relations: { campaign: true },
    });
    if (!membership) throw new NotFoundException('Customer not found');
    if (membership.campaign?.id !== dto.campaignId) {
      throw new BadRequestException(
        'The selected campaign does not belong to this customer membership',
      );
    }

    const entry = this.customerPointRepository.create({
      campaign: membership.campaign,
      customer: membership,
      points: dto.points,
      description: dto.reason,
    });
    const saved = await this.customerPointRepository.save(entry);

    await this.recordAudit(
      actorId,
      'points.adjusted',
      SuperAdminAuditTargetType.CUSTOMER,
      membershipId,
      {
        points: dto.points,
        reason: dto.reason,
        campaignId: dto.campaignId,
        note: dto.reason,
      },
      ip,
    );
    this.clearAnalyticsCache();

    return this.customerPointRepository.findOne({
      where: { id: saved.id },
      relations: { campaign: true, customer: true },
    });
  }

  // ---------------------------------------------------------------------------
  // Redemptions / codes
  // ---------------------------------------------------------------------------

  async listRedemptions(
    query: RedemptionListQueryDto,
  ): Promise<Paginated<CustomersReward>> {
    const { page, limit, skip } = pagination(query);
    const queryBuilder = this.customerRewardRepository
      .createQueryBuilder('redemption')
      .leftJoinAndSelect('redemption.reward', 'reward')
      .leftJoinAndSelect('redemption.campaign', 'campaign')
      .leftJoinAndSelect('campaign.business', 'business')
      .leftJoinAndSelect('redemption.customer', 'customer');

    if (query.campaignId) {
      queryBuilder.andWhere('campaign.id = :campaignId', {
        campaignId: query.campaignId,
      });
    }
    if (query.customerId) {
      queryBuilder.andWhere('customer.id = :customerId', {
        customerId: query.customerId,
      });
    }
    if (query.from) {
      queryBuilder.andWhere('redemption.created_at >= :from', {
        from: parseDay(query.from, false),
      });
    }
    if (query.to) {
      queryBuilder.andWhere('redemption.created_at <= :to', {
        to: parseDay(query.to, true),
      });
    }
    if (query.search) {
      const search = `%${escapeLike(query.search)}%`;
      queryBuilder.andWhere(
        new Brackets((where) => {
          where
            .where('redemption.uniqueCode ILIKE :search', { search })
            .orWhere('redemption.description ILIKE :search', { search })
            .orWhere('reward.title ILIKE :search', { search })
            .orWhere('customer.firstName ILIKE :search', { search })
            .orWhere('customer.lastName ILIKE :search', { search })
            .orWhere('customer.email ILIKE :search', { search });
        }),
      );
    }

    this.orderExpression(
      queryBuilder,
      {
        created_at: 'redemption.created_at',
        uniqueCode: 'redemption.uniqueCode',
        description: 'redemption.description',
      },
      query.sort,
      query.order,
      'redemption.created_at',
    );

    queryBuilder.skip(skip).take(limit);
    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total, page, limit };
  }

  /**
   * Codes issued in one campaign, one kind at a time (each kind lives in its own table).
   * Rows are normalised to CampaignCodeRowDto so the dashboard can revoke any of them
   * through DELETE codes/:id.
   */
  async listCampaignCodes(
    campaignId: string,
    query: CampaignCodeListQueryDto,
  ): Promise<Paginated<CampaignCodeRowDto>> {
    await this.getOrThrowCampaign(campaignId);
    const { page, limit, skip } = pagination(query);
    const kind = query.kind ?? CampaignCodeKind.POINT_CODE;
    const search = query.search ? `%${escapeLike(query.search)}%` : null;
    const ascending = query.order === 'ASC' ? 'ASC' : 'DESC';
    const orderBy = (alias: string) =>
      query.sort === 'code' ? `${alias}.code` : `${alias}.created_at`;
    const customerLabel = (customer?: Customer | null) =>
      customer
        ? {
            id: customer.id,
            label:
              `${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim() ||
              customer.email,
          }
        : null;
    const staffLabel = (staff?: Staff | null) =>
      staff ? { id: staff.id, label: staff.name } : null;
    const base = {
      expiry: null,
      points: null,
      staff: null,
      customer: null,
      reward: null,
    };

    switch (kind) {
      case CampaignCodeKind.POINT_CODE: {
        const qb = this.generatedStaffCodeRepository
          .createQueryBuilder('code')
          .leftJoinAndSelect('code.staff', 'staff')
          .where('code.campaignId = :campaignId', { campaignId });
        if (search) qb.andWhere('code.code ILIKE :search', { search });
        qb.orderBy(orderBy('code'), ascending).skip(skip).take(limit);
        const [rows, total] = await qb.getManyAndCount();
        return {
          data: rows.map((row) => ({
            ...base,
            id: row.id,
            created_at: row.created_at,
            kind,
            code: row.code,
            expiry: row.expiry,
            points: row.points,
            staff: staffLabel(row.staff),
          })),
          total,
          page,
          limit,
        };
      }
      case CampaignCodeKind.REWARD_CODE: {
        const qb = this.generatedRewardCodeRepository
          .createQueryBuilder('code')
          .leftJoinAndSelect('code.staff', 'staff')
          .leftJoinAndSelect('code.reward', 'reward')
          .where('code.campaignId = :campaignId', { campaignId });
        if (search) qb.andWhere('code.code ILIKE :search', { search });
        qb.orderBy(orderBy('code'), ascending).skip(skip).take(limit);
        const [rows, total] = await qb.getManyAndCount();
        return {
          data: rows.map((row) => ({
            ...base,
            id: row.id,
            created_at: row.created_at,
            kind,
            code: row.code,
            expiry: row.expiry,
            staff: staffLabel(row.staff),
            reward: row.reward
              ? { id: row.reward.id, label: row.reward.title }
              : null,
          })),
          total,
          page,
          limit,
        };
      }
      case CampaignCodeKind.REWARD_NUMBER:
      case CampaignCodeKind.CUSTOMER_NUMBER: {
        const repository =
          kind === CampaignCodeKind.REWARD_NUMBER
            ? this.rewardCustomerNumberRepository
            : this.customerNumberRepository;
        const qb = (
          repository as Repository<RewardCustomerNumber | CustomerNumber>
        )
          .createQueryBuilder('code')
          .leftJoinAndSelect('code.customer', 'customer')
          .where('code.campaignId = :campaignId', { campaignId });
        if (search) {
          qb.andWhere(
            new Brackets((where) => {
              where
                .where('code.code ILIKE :search', { search })
                .orWhere('customer.email ILIKE :search', { search });
            }),
          );
        }
        qb.orderBy(orderBy('code'), ascending).skip(skip).take(limit);
        const [rows, total] = await qb.getManyAndCount();
        return {
          data: rows.map((row) => ({
            ...base,
            id: row.id,
            created_at: row.created_at,
            kind,
            code: row.code,
            customer: customerLabel(row.customer),
          })),
          total,
          page,
          limit,
        };
      }
    }
  }

  async revokeCode(
    id: string,
    actorId?: string,
    ip?: string,
    reason?: string,
  ): Promise<{ success: true }> {
    const note = reason?.trim() || 'Code revoked';
    const staffCode = await this.generatedStaffCodeRepository.findOne({
      where: { id },
    });
    if (staffCode) {
      await this.generatedStaffCodeRepository.remove(staffCode);
      await this.recordAudit(
        actorId,
        'code.revoked',
        SuperAdminAuditTargetType.CODE,
        id,
        { code: staffCode.code, kind: 'point_code', reason: reason?.trim() || null, note },
        ip,
      );
      return { success: true };
    }

    const rewardCode = await this.generatedRewardCodeRepository.findOne({
      where: { id },
    });
    if (rewardCode) {
      await this.generatedRewardCodeRepository.remove(rewardCode);
      await this.recordAudit(
        actorId,
        'code.revoked',
        SuperAdminAuditTargetType.CODE,
        id,
        { code: rewardCode.code, kind: 'reward_code', reason: reason?.trim() || null, note },
        ip,
      );
      return { success: true };
    }

    const rewardNumber = await this.rewardCustomerNumberRepository.findOne({
      where: { id },
    });
    if (rewardNumber) {
      await this.rewardCustomerNumberRepository.remove(rewardNumber);
      await this.recordAudit(
        actorId,
        'code.revoked',
        SuperAdminAuditTargetType.CODE,
        id,
        { code: rewardNumber.code, kind: 'reward_number', reason: reason?.trim() || null, note },
        ip,
      );
      return { success: true };
    }

    const customerNumber = await this.customerNumberRepository.findOne({
      where: { id },
    });
    if (customerNumber) {
      await this.customerNumberRepository.remove(customerNumber);
      await this.recordAudit(
        actorId,
        'code.revoked',
        SuperAdminAuditTargetType.CODE,
        id,
        { code: customerNumber.code, kind: 'customer_number', reason: reason?.trim() || null, note },
        ip,
      );
      return { success: true };
    }

    throw new NotFoundException('Code not found');
  }

  // ---------------------------------------------------------------------------
  // Audit log
  // ---------------------------------------------------------------------------

  async listAuditLogs(
    query: AuditLogListQueryDto,
  ): Promise<Paginated<SuperAdminAuditLog>> {
    const { page, limit, skip } = pagination(query);
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.actor', 'actor');

    if (query.actorId) {
      queryBuilder.andWhere('actor.id = :actorId', {
        actorId: query.actorId,
      });
    }
    if (query.targetType) {
      queryBuilder.andWhere('log.targetType = :targetType', {
        targetType: query.targetType,
      });
    }
    if (query.targetId) {
      queryBuilder.andWhere('log.targetId = :targetId', {
        targetId: query.targetId,
      });
    }
    if (query.from) {
      queryBuilder.andWhere('log.created_at >= :from', {
        from: parseDay(query.from, false),
      });
    }
    if (query.to) {
      queryBuilder.andWhere('log.created_at <= :to', {
        to: parseDay(query.to, true),
      });
    }
    if (query.search) {
      const search = `%${escapeLike(query.search)}%`;
      queryBuilder.andWhere(
        new Brackets((where) => {
          where
            .where('log.action ILIKE :search', { search })
            .orWhere('log.targetId ILIKE :search', { search })
            .orWhere('actor.fullName ILIKE :search', { search })
            .orWhere('actor.email ILIKE :search', { search });
        }),
      );
    }

    this.orderExpression(
      queryBuilder,
      {
        created_at: 'log.created_at',
        action: 'log.action',
        targetType: 'log.targetType',
      },
      query.sort,
      query.order,
      'log.created_at',
    );

    queryBuilder.skip(skip).take(limit);
    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total, page, limit };
  }
}
