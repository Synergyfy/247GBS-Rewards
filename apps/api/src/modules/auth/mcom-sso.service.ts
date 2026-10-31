import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { hashPassword } from '../../bcypt/bcrypt.js';
import { Role } from '../../core/enums/roles.js';
import { User } from '../user/entities/user.entity.js';

interface McomPlatformEntitlement {
  access?: {
    hasAccess?: boolean;
    accessType?: string;
    reason?: string;
  };
  whitelabel?: {
    enabled?: boolean;
    granted?: boolean;
    grantedAt?: string | null;
    roleEligible?: boolean;
  };
}

export interface McomSsoUserInfo {
  id?: string;
  sub?: string;
  email: string;
  role?: string;
  profileType?: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  name?: string | null;
  phone?: string | null;
  country?: string | null;
  businessId?: string | null;
  businessName?: string | null;
  entitlement?: McomPlatformEntitlement | null;
}

/**
 * Exchanges a MCOM Central Hub SSO access token for a local 247GBS Rewards
 * session. Central Hub remains the source of truth for identity and access:
 * we call its userinfo endpoint and enforce the white-label admission gate
 * (BUSINESS account + explicit grant for this platform) before provisioning.
 */
@Injectable()
export class McomSsoService {
  private readonly logger = new Logger(McomSsoService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async authenticate(accessToken: string): Promise<User> {
    if (!accessToken) {
      throw new UnauthorizedException('Missing Central Hub access token');
    }

    const baseUrl = (
      process.env.MCOM_SOLUTIONS_URL || 'http://localhost:3010'
    ).replace(/\/+$/, '');
    const clientId = process.env.MCOM_CLIENT_ID || '247gbs-rewards';

    let response: Response;
    try {
      response = await fetch(
        `${baseUrl}/api/v1/auth/sso/userinfo?client_id=${encodeURIComponent(clientId)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Client-Id': clientId,
            Accept: 'application/json',
          },
          cache: 'no-store',
        },
      );
    } catch (error: any) {
      this.logger.error(`Central Hub userinfo request failed: ${error?.message}`);
      throw new BadGatewayException(
        'Unable to reach MCOM Central Hub. Please try again.',
      );
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      this.logger.warn(
        `Central Hub rejected SSO token (${response.status}): ${body}`,
      );
      throw new UnauthorizedException(
        'Central Hub could not verify this session. Please sign in again.',
      );
    }

    const info = (await response.json()) as McomSsoUserInfo;
    this.assertWhitelabelAccess(info);

    return this.provisionLocalUser(info);
  }

  /**
   * White-label admission gate. A grant is the entire entitlement: membership,
   * packages, access passes, verification and billing are intentionally not
   * consulted for a granted business.
   */
  private assertWhitelabelAccess(info: McomSsoUserInfo): void {
    const entitlement = info.entitlement;

    if (info.profileType !== 'BUSINESS') {
      throw new ForbiddenException(
        'White-label access is available to business accounts only.',
      );
    }

    const granted =
      entitlement?.access?.hasAccess === true &&
      entitlement?.access?.accessType === 'WHITELABEL' &&
      entitlement?.whitelabel?.granted === true;

    if (!granted) {
      this.logger.warn(
        `White-label access denied for ${info.email} (reason: ${
          entitlement?.access?.reason || 'WHITELABEL_ACCESS_DENIED'
        })`,
      );
      throw new ForbiddenException(
        'White-label access has not been granted for this business. Please contact MCOM.',
      );
    }
  }

  /**
   * JIT-provision (or refresh) the local account from the canonical Central Hub
   * identity. Keyed on the verified central email address.
   */
  private async provisionLocalUser(info: McomSsoUserInfo): Promise<User> {
    const email = (info.email || '').trim().toLowerCase();
    if (!email) {
      throw new UnauthorizedException(
        'Central Hub did not return an email address for this account.',
      );
    }

    const fullName =
      info.fullName?.trim() ||
      [info.firstName, info.lastName].filter(Boolean).join(' ').trim() ||
      info.name?.trim() ||
      email;

    const existing = await this.userRepository.findOne({ where: { email } });

    if (existing) {
      const updates: Partial<User> = {};
      if (fullName && existing.fullName !== fullName) {
        updates.fullName = fullName;
      }
      if (info.country && existing.location !== info.country) {
        updates.location = info.country;
      }
      if (Object.keys(updates).length > 0) {
        await this.userRepository.update(existing.id, updates);
        Object.assign(existing, updates);
      }
      return existing;
    }

    const phoneNumber = await this.resolvePhoneNumber(info);
    const password = await hashPassword(randomBytes(32).toString('hex'));

    const user = this.userRepository.create({
      fullName,
      email,
      role: Role.ADMIN,
      phoneNumber,
      location: info.country || null,
      password,
    });

    return this.userRepository.save(user);
  }

  private async resolvePhoneNumber(info: McomSsoUserInfo): Promise<string> {
    const phone = info.phone?.trim();
    if (phone) {
      const taken = await this.userRepository.exists({
        where: { phoneNumber: phone },
      });
      if (!taken) return phone;
    }

    const centralId = info.id || info.sub || randomBytes(8).toString('hex');
    return `mcom-${centralId}`;
  }
}
