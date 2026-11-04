import { jest } from '@jest/globals';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';

import { AppModule } from '../src/app.module.js';
import dataSource from '../src/database/data-source.js';
import { Role } from '../src/core/enums/roles.js';
import { SuperAdminAuditTargetType } from '../src/modules/super-admin/entities/super-admin-audit-log.entity.js';
import { IDS, seedDatabase } from './seed.js';

jest.setTimeout(120_000);

interface Tokens {
  superAdmin: string;
  admin: string;
}

describe('Super Admin dashboard API (e2e)', () => {
  let app: INestApplication;
  let tokens: Tokens;

  const base = '/super-admin';
  const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    const database = String(dataSource.options.database ?? '');
    if (!database.endsWith('_test')) {
      throw new Error(
        `Refusing to run destructive e2e setup against database "${database}"`,
      );
    }

    if (!dataSource.isInitialized) await dataSource.initialize();
    await dataSource.query('DROP SCHEMA public CASCADE');
    await dataSource.query('CREATE SCHEMA public');
    await dataSource.runMigrations();
    await seedDatabase(dataSource);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    const jwt = app.get(JwtService);
    tokens = {
      superAdmin: jwt.sign({
        sub: IDS.superAdmin,
        email: 'super@test.local',
        role: Role.SUPER_ADMIN,
      }),
      admin: jwt.sign({
        sub: IDS.admin1,
        email: 'maya@test.local',
        role: Role.ADMIN,
      }),
    };
  });

  afterAll(async () => {
    await app?.close();
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  describe('authentication and authorization', () => {
    it('logs a real super admin in', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth')
        .send({ email: 'super@test.local', password: 'password' })
        .expect(201);

      expect(response.body.accessToken).toBeTruthy();
      expect(response.body.role).toBe(Role.SUPER_ADMIN);
      expect(response.body.name).toBe('Super Admin');
    });

    it('rejects unauthenticated calls', async () => {
      await request(app.getHttpServer()).get(`${base}/admins`).expect(401);
    });

    it('rejects authenticated non-super-admin calls', async () => {
      await request(app.getHttpServer())
        .get(`${base}/admins`)
        .set(auth(tokens.admin))
        .expect(403);
    });
  });

  describe('swagger documentation', () => {
    it('documents every super-admin endpoint', () => {
      const config = new DocumentBuilder()
        .setTitle('Test')
        .addBearerAuth()
        .build();
      const document = SwaggerModule.createDocument(app, config);
      const expectedPaths = [
        '/super-admin/admins',
        '/super-admin/users',
        '/super-admin/users/{id}',
        '/super-admin/users/{id}/status',
        '/super-admin/users/{id}/reset-password',
        '/super-admin/admins/{id}/businesses',
        '/super-admin/users/{userId}/business',
        '/super-admin/businesses',
        '/super-admin/businesses/{id}',
        '/super-admin/businesses/{id}/staff',
        '/super-admin/staff/{id}',
        '/super-admin/campaigns',
        '/super-admin/campaigns/{id}',
        '/super-admin/campaigns/{id}/status',
        '/super-admin/analytics/platform',
        '/super-admin/analytics/user/{id}',
        '/super-admin/analytics/campaign/{id}',
        '/super-admin/customers',
        '/super-admin/customers/{id}',
        '/super-admin/customers/{id}/points-adjustment',
        '/super-admin/redemptions',
        '/super-admin/codes/{id}',
        '/super-admin/audit-logs',
      ];
      for (const path of expectedPaths) {
        expect(document.paths[path]).toBeDefined();
      }
      expect(document.paths['/super-admin/admins'].get?.tags).toContain(
        'Super Admin',
      );
    });
  });

  describe('users and admins', () => {
    it('lists admins with pagination and footprint counts', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/admins`)
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(25);
      expect(response.body.total).toBe(2);
      const maya = response.body.data.find(
        (row: { id: string }) => row.id === IDS.admin1,
      );
      expect(maya.businessCount).toBe(1);
      expect(maya.campaignCount).toBe(2);
      expect(maya.customerCount).toBe(3);
      expect(maya.password).toBeUndefined();
    });

    it('searches and sorts admins by customer count', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/admins`)
        .query({ search: 'maya', sort: 'customerCount', order: 'DESC' })
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.total).toBe(1);
      expect(response.body.data[0].id).toBe(IDS.admin1);
    });

    it('lists and filters users', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/users`)
        .query({ role: Role.ADMIN, isActive: true, signupSource: 'mcom' })
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.total).toBe(1);
      expect(response.body.data[0].id).toBe(IDS.admin1);
    });

    it('validates list query DTOs', async () => {
      await request(app.getHttpServer())
        .get(`${base}/users`)
        .query({ page: 0, limit: 500, isActive: 'maybe' })
        .set(auth(tokens.superAdmin))
        .expect(400);
    });

    it('gets a user with their businesses', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/users/${IDS.admin1}`)
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.id).toBe(IDS.admin1);
      expect(response.body.businesses).toHaveLength(1);
      expect(response.body.businesses[0].id).toBe(IDS.business1);
      expect(response.body.password).toBeUndefined();
    });

    it('returns 404 for an unknown user', async () => {
      await request(app.getHttpServer())
        .get(`${base}/users/00000000-0000-4000-8000-000000000000`)
        .set(auth(tokens.superAdmin))
        .expect(404);
    });

    it('updates a user', async () => {
      const response = await request(app.getHttpServer())
        .patch(`${base}/users/${IDS.admin2}`)
        .set(auth(tokens.superAdmin))
        .send({ location: 'Seattle', fullName: 'Oliver Grant Jr' })
        .expect(200);

      expect(response.body.location).toBe('Seattle');
      expect(response.body.fullName).toBe('Oliver Grant Jr');
    });

    it('deactivates and reactivates a user, blocking login while inactive', async () => {
      const deactivated = await request(app.getHttpServer())
        .patch(`${base}/users/${IDS.admin2}/status`)
        .set(auth(tokens.superAdmin))
        .send({ isActive: false, reason: 'Support review' })
        .expect(200);

      expect(deactivated.body.isActive).toBe(false);

      await request(app.getHttpServer())
        .post('/auth')
        .send({ email: 'oliver@test.local', password: 'password' })
        .expect(403);

      const activated = await request(app.getHttpServer())
        .patch(`${base}/users/${IDS.admin2}/status`)
        .set(auth(tokens.superAdmin))
        .send({ isActive: true, reason: 'Review complete' })
        .expect(200);

      expect(activated.body.isActive).toBe(true);
    });

    it('prevents a super admin from deactivating themselves', async () => {
      await request(app.getHttpServer())
        .patch(`${base}/users/${IDS.superAdmin}/status`)
        .set(auth(tokens.superAdmin))
        .send({ isActive: false })
        .expect(400);
    });

    it('resets a password and returns a temporary password', async () => {
      const response = await request(app.getHttpServer())
        .post(`${base}/users/${IDS.admin1}/reset-password`)
        .set(auth(tokens.superAdmin))
        .send({ reason: 'Support requested reset' })
        .expect(201);

      expect(response.body.temporaryPassword).toMatch(/^GBS-/);
    });

    it('creates a user and deletes it', async () => {
      const created = await request(app.getHttpServer())
        .post(`${base}/users`)
        .set(auth(tokens.superAdmin))
        .send({
          fullName: 'Temp Admin',
          email: 'temp.admin@test.local',
          phoneNumber: '+10000000099',
          location: 'Denver',
        })
        .expect(201);

      expect(created.body.id).toBeTruthy();
      expect(created.body.role).toBe(Role.ADMIN);
      expect(created.body.password).toBeUndefined();

      const business = await request(app.getHttpServer())
        .post(`${base}/users/${created.body.id}/business`)
        .set(auth(tokens.superAdmin))
        .send({
          name: 'Temporary Business',
          email: 'temp.biz@test.local',
          phoneNumber: '+10000000097',
        })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`${base}/users/${created.body.id}`)
        .set(auth(tokens.superAdmin))
        .send({ reason: 'Temporary test account' })
        .expect(200);

      await request(app.getHttpServer())
        .get(`${base}/users/${created.body.id}`)
        .set(auth(tokens.superAdmin))
        .expect(404);

      // Deleting the owner also removes the businesses it owned.
      await request(app.getHttpServer())
        .get(`${base}/businesses/${business.body.id}`)
        .set(auth(tokens.superAdmin))
        .expect(404);
    });

    it('rejects duplicate user email and phone', async () => {
      await request(app.getHttpServer())
        .post(`${base}/users`)
        .set(auth(tokens.superAdmin))
        .send({
          fullName: 'Duplicate',
          email: 'maya@test.local',
          phoneNumber: '+10000000098',
        })
        .expect(409);
    });

    it('lists businesses owned by an admin', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/admins/${IDS.admin1}/businesses`)
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(IDS.business1);
    });
  });

  describe('businesses and staff', () => {
    it('lists businesses with pagination, owner filter and search', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/businesses`)
        .query({ userId: IDS.admin1, search: 'northstar' })
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.total).toBe(1);
      expect(response.body.data[0].id).toBe(IDS.business1);
      expect(response.body.data[0].user.id).toBe(IDS.admin1);
      expect(response.body.data[0].campaigns).toHaveLength(2);
    });

    it('gets a business with campaigns, staff, segments and seasons', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/businesses/${IDS.business1}`)
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.id).toBe(IDS.business1);
      expect(response.body.campaigns).toHaveLength(2);
      expect(response.body.staffs).toHaveLength(1);
      expect(Array.isArray(response.body.segments)).toBe(true);
      expect(response.body.seasons).toHaveLength(1);
      expect(response.body.user.password).toBeUndefined();
    });

    it('creates, updates and deletes a business for a user', async () => {
      const created = await request(app.getHttpServer())
        .post(`${base}/users/${IDS.admin1}/business`)
        .set(auth(tokens.superAdmin))
        .send({
          name: 'Second Location',
          email: 'second@northstar.test',
          phoneNumber: '+10000000021',
          website: 'https://second.northstar.test',
          address: {
            street: '200 Market St',
            postalCode: '78702',
            city: 'Austin',
            state: 'TX',
          },
          socials: { instagram: 'https://instagram.com/second' },
          links: [{ text: 'Menu', url: 'https://second.northstar.test/menu' }],
        })
        .expect(201);

      expect(created.body.id).toBeTruthy();
      expect(created.body.user.id).toBe(IDS.admin1);
      expect(created.body.links).toHaveLength(1);

      const updated = await request(app.getHttpServer())
        .patch(`${base}/businesses/${created.body.id}`)
        .set(auth(tokens.superAdmin))
        .send({
          name: 'Second Location Updated',
          address: { city: 'Dallas' },
          socials: { facebook: 'https://facebook.com/second' },
          links: [{ text: 'Order', url: 'https://second.northstar.test/order' }],
        })
        .expect(200);

      expect(updated.body.name).toBe('Second Location Updated');

      const detail = await request(app.getHttpServer())
        .get(`${base}/businesses/${created.body.id}`)
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(detail.body.address.city).toBe('Dallas');
      expect(detail.body.socials.facebook).toBe('https://facebook.com/second');
      expect(detail.body.links).toHaveLength(1);
      expect(detail.body.links[0].text).toBe('Order');

      await request(app.getHttpServer())
        .delete(`${base}/businesses/${created.body.id}`)
        .set(auth(tokens.superAdmin))
        .send({ reason: 'Created during e2e run' })
        .expect(200);

      await request(app.getHttpServer())
        .get(`${base}/businesses/${created.body.id}`)
        .set(auth(tokens.superAdmin))
        .expect(404);
    });

    it('lists and updates staff', async () => {
      const staff = await request(app.getHttpServer())
        .get(`${base}/businesses/${IDS.business1}/staff`)
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(staff.body).toHaveLength(1);

      const updated = await request(app.getHttpServer())
        .patch(`${base}/staff/${IDS.staff1}`)
        .set(auth(tokens.superAdmin))
        .send({ isActive: false, name: 'Sam Staff Updated' })
        .expect(200);

      expect(updated.body.isActive).toBe(false);
      expect(updated.body.name).toBe('Sam Staff Updated');
    });
  });

  describe('campaigns', () => {
    it('lists campaigns with type and effective-active filters', async () => {
      const seasonal = await request(app.getHttpServer())
        .get(`${base}/campaigns`)
        .query({ type: 'SEASONAL' })
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(seasonal.body.total).toBe(2);

      const active = await request(app.getHttpServer())
        .get(`${base}/campaigns`)
        .query({ active: true })
        .set(auth(tokens.superAdmin))
        .expect(200);

      const ids = active.body.data.map((row: { id: string }) => row.id);
      expect(ids).toContain(IDS.campaignPreset);
      expect(ids).toContain(IDS.campaignSeasonalActive);
      expect(ids).not.toContain(IDS.campaignSeasonalExpired);
    });

    it('gets a campaign with rewards and owner', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/campaigns/${IDS.campaignPreset}`)
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.rewards).toHaveLength(1);
      expect(response.body.business.id).toBe(IDS.business1);
      expect(response.body.business.user.id).toBe(IDS.admin1);
    });

    it('activates and deactivates a campaign', async () => {
      const deactivated = await request(app.getHttpServer())
        .patch(`${base}/campaigns/${IDS.campaignPreset}/status`)
        .set(auth(tokens.superAdmin))
        .send({ isActive: false, reason: 'Merchant request' })
        .expect(200);

      expect(deactivated.body.isActive).toBe(false);

      const activated = await request(app.getHttpServer())
        .patch(`${base}/campaigns/${IDS.campaignPreset}/status`)
        .set(auth(tokens.superAdmin))
        .send({ isActive: true, reason: 'Merchant resumed' })
        .expect(200);

      expect(activated.body.isActive).toBe(true);
    });
  });

  describe('analytics', () => {
    it('returns platform analytics with totals, series and top businesses', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/analytics/platform`)
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.totals.users).toBe(3);
      expect(response.body.totals.usersByRole.super_admin).toBe(1);
      expect(response.body.totals.usersByRole.admin).toBe(2);
      expect(response.body.totals.businesses).toBe(2);
      expect(response.body.totals.campaigns).toBe(3);
      expect(response.body.totals.activeCampaigns).toBe(2);
      expect(response.body.totals.customers).toBe(4);
      expect(response.body.totals.pointsIssued).toBe(850);
      expect(response.body.totals.pointsRedeemed).toBe(100);
      expect(response.body.totals.rewardsRedeemed).toBe(1);
      expect(response.body.topBusinesses).toHaveLength(2);
      expect(Array.isArray(response.body.series)).toBe(true);
      expect(response.body.series.length).toBeGreaterThan(0);
    });

    it('honours the analytics date range', async () => {
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86_400_000)
        .toISOString()
        .slice(0, 10);
      const response = await request(app.getHttpServer())
        .get(`${base}/analytics/platform`)
        .query({ from: yesterday, to: today })
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.series).toHaveLength(2);
    });

    it('returns analytics for an admin', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/analytics/user/${IDS.admin1}`)
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.totalCampaigns).toBe(2);
      expect(response.body.activeCampaigns).toBe(2);
      expect(response.body.inactiveCampaigns).toBe(0);
      expect(response.body.totalCustomers).toBe(3);
      expect(response.body.totalPointsIssued).toBe(800);
      expect(response.body.totalRewardsRedeemed).toBe(1);
    });

    it('returns analytics for a campaign', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/analytics/campaign/${IDS.campaignPreset}`)
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.campaignName).toBe('Summer Rewards');
      expect(response.body.isActive).toBe(true);
      expect(response.body.totalCustomers).toBe(2);
      expect(response.body.totalPointsIssued).toBe(700);
      expect(response.body.totalRewardsRedeemed).toBe(1);
      expect(response.body.pointsActivity).toHaveLength(7);
      expect(response.body.rewardsActivity).toHaveLength(7);
    });
  });

  describe('customers, redemptions and points', () => {
    it('groups customer memberships by email', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/customers`)
        .query({ search: 'sam@test.local' })
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.total).toBe(1);
      const sam = response.body.data[0];
      expect(sam.campaignCount).toBe(2);
      expect(sam.memberships).toHaveLength(2);
      expect(sam.balance).toBe(500);
      expect(sam.memberships[0].campaign).toBeDefined();
    });

    it('scopes customer memberships to a campaign', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/customers`)
        .query({ campaignId: IDS.campaignPreset })
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.total).toBe(2);
      const sam = response.body.data.find(
        (row: { email: string }) => row.email === 'sam@test.local',
      );
      expect(sam.campaignCount).toBe(1);
      expect(sam.balance).toBe(400);
    });

    it('scopes customers to a business', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/customers`)
        .query({ businessId: IDS.business1 })
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.total).toBe(2);
    });

    it('supports pagination and balance sorting', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/customers`)
        .query({ page: 1, limit: 1, sort: 'balance', order: 'DESC' })
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.total).toBe(3);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].email.toLowerCase()).toBe('sam@test.local');
    });

    it('returns a customer profile with ledger and redemptions', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/customers/${IDS.membershipSamPreset}`)
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.campaignCount).toBe(2);
      expect(response.body.ledger).toHaveLength(2);
      expect(response.body.redemptions).toHaveLength(1);
      expect(response.body.redemptions[0].reward.title).toBe('Free latte');
    });

    it('adjusts points and writes a ledger entry', async () => {
      const response = await request(app.getHttpServer())
        .post(`${base}/customers/${IDS.membershipSamPreset}/points-adjustment`)
        .set(auth(tokens.superAdmin))
        .send({
          campaignId: IDS.campaignPreset,
          points: 250,
          reason: 'Goodwill adjustment',
        })
        .expect(201);

      expect(response.body.points).toBe(250);
      expect(response.body.description).toBe('Goodwill adjustment');

      const profile = await request(app.getHttpServer())
        .get(`${base}/customers/${IDS.membershipSamPreset}`)
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(
        profile.body.ledger.some(
          (entry: { description: string }) =>
            entry.description === 'Goodwill adjustment',
        ),
      ).toBe(true);
    });

    it('rejects a campaign that does not match the membership', async () => {
      await request(app.getHttpServer())
        .post(`${base}/customers/${IDS.membershipSamPreset}/points-adjustment`)
        .set(auth(tokens.superAdmin))
        .send({
          campaignId: IDS.campaignSeasonalExpired,
          points: 10,
          reason: 'Wrong campaign',
        })
        .expect(400);
    });

    it('lists redemptions with filters', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/redemptions`)
        .query({ campaignId: IDS.campaignPreset })
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.total).toBe(1);
      expect(response.body.data[0].reward.title).toBe('Free latte');
      expect(response.body.data[0].customer.email).toBe('sam@test.local');
    });

    it('revokes every supported code kind', async () => {
      for (const id of [
        IDS.pointCode,
        IDS.rewardCode,
        IDS.customerNumber,
        IDS.rewardCustomerNumber,
      ]) {
        const response = await request(app.getHttpServer())
          .delete(`${base}/codes/${id}`)
          .set(auth(tokens.superAdmin))
          .expect(200);
        expect(response.body.success).toBe(true);
      }

      await request(app.getHttpServer())
        .delete(`${base}/codes/${IDS.pointCode}`)
        .set(auth(tokens.superAdmin))
        .expect(404);
    });
  });

  describe('audit log', () => {
    it('records every mutation and lists them newest first', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/audit-logs`)
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(response.body.total).toBeGreaterThan(10);
      const actions = response.body.data.map(
        (row: { action: string }) => row.action,
      );
      expect(actions).toEqual(
        expect.arrayContaining([
          'user.updated',
          'user.status_changed',
          'user.password_reset',
          'user.created',
          'user.deleted',
          'business.created',
          'business.updated',
          'business.deleted',
          'staff.updated',
          'campaign.status_changed',
          'points.adjusted',
          'code.revoked',
        ]),
      );
      expect(response.body.data[0].actor.id).toBe(IDS.superAdmin);
      expect(response.body.data[0].actor.password).toBeUndefined();
    });

    it('filters audit logs by actor, target and target type', async () => {
      const byTarget = await request(app.getHttpServer())
        .get(`${base}/audit-logs`)
        .query({
          targetType: SuperAdminAuditTargetType.USER,
          targetId: IDS.admin2,
        })
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(byTarget.body.total).toBeGreaterThanOrEqual(2);
      expect(
        byTarget.body.data.every(
          (row: { targetType: string; targetId: string }) =>
            row.targetType === 'user' && row.targetId === IDS.admin2,
        ),
      ).toBe(true);

      const byActor = await request(app.getHttpServer())
        .get(`${base}/audit-logs`)
        .query({ actorId: IDS.superAdmin, search: 'campaign' })
        .set(auth(tokens.superAdmin))
        .expect(200);

      expect(byActor.body.total).toBeGreaterThanOrEqual(1);
    });

    it('validates audit-log filters', async () => {
      await request(app.getHttpServer())
        .get(`${base}/audit-logs`)
        .query({ targetType: 'not-a-type' })
        .set(auth(tokens.superAdmin))
        .expect(400);
    });
  });

  describe('destructive cascade', () => {
    it('deletes a business and its campaigns, customers and staff', async () => {
      await request(app.getHttpServer())
        .delete(`${base}/businesses/${IDS.business2}`)
        .set(auth(tokens.superAdmin))
        .send({ reason: 'Cascade test' })
        .expect(200);

      await request(app.getHttpServer())
        .get(`${base}/businesses/${IDS.business2}`)
        .set(auth(tokens.superAdmin))
        .expect(404);

      const campaigns = await request(app.getHttpServer())
        .get(`${base}/campaigns`)
        .query({ businessId: IDS.business2 })
        .set(auth(tokens.superAdmin))
        .expect(200);
      expect(campaigns.body.total).toBe(0);

      const customers = await request(app.getHttpServer())
        .get(`${base}/customers`)
        .query({ businessId: IDS.business2 })
        .set(auth(tokens.superAdmin))
        .expect(200);
      expect(customers.body.total).toBe(0);
    });
  });
});
