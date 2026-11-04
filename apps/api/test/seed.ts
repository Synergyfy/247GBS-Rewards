import type { DataSource } from 'typeorm';
import { hashPassword } from '../src/bcypt/bcrypt.js';
import { Role } from '../src/core/enums/roles.js';
import { SignupSource } from '../src/core/enums/signupSource.js';

export const IDS = {
  superAdmin: '11111111-1111-4111-8111-111111111111',
  admin1: '22222222-2222-4222-8222-222222222222',
  admin2: '33333333-3333-4333-8333-333333333333',
  business1: 'a1111111-1111-4111-8111-111111111111',
  business2: 'a2222222-2222-4222-8222-222222222222',
  seasonActive: 'b1111111-1111-4111-8111-111111111111',
  seasonExpired: 'b2222222-2222-4222-8222-222222222222',
  campaignPreset: 'c1111111-1111-4111-8111-111111111111',
  campaignSeasonalActive: 'c2222222-2222-4222-8222-222222222222',
  campaignSeasonalExpired: 'c3333333-3333-4333-8333-333333333333',
  reward1: 'd1111111-1111-4111-8111-111111111111',
  staff1: 'e1111111-1111-4111-8111-111111111111',
  membershipSamPreset: 'f1111111-1111-4111-8111-111111111111',
  membershipSamSeasonal: 'f2222222-2222-4222-8222-222222222222',
  membershipTaylorExpired: 'f3333333-3333-4333-8333-333333333333',
  membershipJordanPreset: 'f4444444-4444-4444-8444-444444444444',
  pointCode: 'a1a1a1a1-1111-4111-8111-111111111111',
  rewardCode: 'a2a2a2a2-2222-4222-8222-222222222222',
  customerNumber: 'a3a3a3a3-3333-4333-8333-333333333333',
  rewardCustomerNumber: 'a4a4a4a4-4444-4444-8444-444444444444',
} as const;

const daysAgo = (days: number): Date =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

export async function seedDatabase(dataSource: DataSource): Promise<void> {
  const password = await hashPassword('password');

  await dataSource.query(
    `INSERT INTO "Users"
       ("id", "created_at", "updated_at", "fullName", "email", "role", "phoneNumber", "location", "password", "signupSource", "isActive")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)`,
    [
      IDS.superAdmin,
      daysAgo(10),
      daysAgo(10),
      'Super Admin',
      'super@test.local',
      Role.SUPER_ADMIN,
      '+10000000000',
      'Austin',
      password,
      SignupSource.MCOM,
    ],
  );
  await dataSource.query(
    `INSERT INTO "Users"
       ("id", "created_at", "updated_at", "fullName", "email", "role", "phoneNumber", "location", "password", "signupSource", "isActive")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)`,
    [
      IDS.admin1,
      daysAgo(5),
      daysAgo(5),
      'Maya Chen',
      'maya@test.local',
      Role.ADMIN,
      '+10000000001',
      'Austin',
      password,
      SignupSource.MCOM,
    ],
  );
  await dataSource.query(
    `INSERT INTO "Users"
       ("id", "created_at", "updated_at", "fullName", "email", "role", "phoneNumber", "location", "password", "signupSource", "isActive")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)`,
    [
      IDS.admin2,
      daysAgo(3),
      daysAgo(3),
      'Oliver Grant',
      'oliver@test.local',
      Role.ADMIN,
      '+10000000002',
      'Portland',
      password,
      SignupSource.STOCK_AUDIT,
    ],
  );

  await dataSource.query(
    `INSERT INTO "Business"
       ("id", "created_at", "updated_at", "name", "email", "phoneNumber", "website", "userId")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      IDS.business1,
      daysAgo(4),
      daysAgo(4),
      'Northstar Coffee',
      'hello@northstar.test',
      '+10000000011',
      'https://northstar.test',
      IDS.admin1,
    ],
  );
  await dataSource.query(
    `INSERT INTO "Business"
       ("id", "created_at", "updated_at", "name", "email", "phoneNumber", "website", "userId")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      IDS.business2,
      daysAgo(3),
      daysAgo(3),
      'Fieldwork Market',
      'hello@fieldwork.test',
      '+10000000012',
      'https://fieldwork.test',
      IDS.admin2,
    ],
  );

  await dataSource.query(
    `INSERT INTO "Season" ("id", "created_at", "updated_at", "name", "startDate", "endDate", "businessId")
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      IDS.seasonActive,
      daysAgo(4),
      daysAgo(4),
      'Active Season',
      daysAgo(2),
      daysAgo(-10),
      IDS.business1,
    ],
  );
  await dataSource.query(
    `INSERT INTO "Season" ("id", "created_at", "updated_at", "name", "startDate", "endDate", "businessId")
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      IDS.seasonExpired,
      daysAgo(20),
      daysAgo(20),
      'Expired Season',
      daysAgo(40),
      daysAgo(10),
      IDS.business2,
    ],
  );

  const insertCampaign = async (
    id: string,
    type: 'PRESET' | 'SEASONAL',
    name: string,
    uniqueCode: string,
    businessId: string,
    seasonId: string | null,
    ageDays: number,
  ) => {
    await dataSource.query(
      `INSERT INTO "Campaign"
         ("id", "created_at", "updated_at", "type", "name", "uniqueCode", "businessId", "seasonId", "startDate", "endDate", "signupPoints", "isActive")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)`,
      [
        id,
        daysAgo(ageDays),
        daysAgo(ageDays),
        type,
        name,
        uniqueCode,
        businessId,
        seasonId,
        daysAgo(ageDays + 10),
        null,
        '20',
      ],
    );
  };

  await insertCampaign(
    IDS.campaignPreset,
    'PRESET',
    'Summer Rewards',
    'CAMP-PRESET',
    IDS.business1,
    null,
    6,
  );
  await insertCampaign(
    IDS.campaignSeasonalActive,
    'SEASONAL',
    'Active Seasonal',
    'CAMP-SEASON-ACTIVE',
    IDS.business1,
    IDS.seasonActive,
    5,
  );
  await insertCampaign(
    IDS.campaignSeasonalExpired,
    'SEASONAL',
    'Expired Seasonal',
    'CAMP-SEASON-EXPIRED',
    IDS.business2,
    IDS.seasonExpired,
    4,
  );

  await dataSource.query(
    `INSERT INTO "Rewards"
       ("id", "created_at", "updated_at", "title", "pointCost", "currency", "rewardValue", "activeFrom", "expires", "description", "type", "quantityAvailable", "quantityRemaining", "userId", "campaignId")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    [
      IDS.reward1,
      daysAgo(5),
      daysAgo(5),
      'Free latte',
      '100',
      '$',
      '$5',
      daysAgo(30).toISOString(),
      daysAgo(-30).toISOString(),
      'A member reward',
      'STANDARD',
      100,
      95,
      IDS.admin1,
      IDS.campaignPreset,
    ],
  );

  await dataSource.query(
    `INSERT INTO "Staffs" ("id", "created_at", "updated_at", "name", "email", "password", "isActive", "businessId")
     VALUES ($1, $2, $3, $4, $5, $6, true, $7)`,
    [
      IDS.staff1,
      daysAgo(4),
      daysAgo(4),
      'Sam Staff',
      'staff@northstar.test',
      password,
      IDS.business1,
    ],
  );

  const insertCustomer = async (
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    campaignId: string,
    ageDays: number,
  ) => {
    await dataSource.query(
      `INSERT INTO "Customers" ("id", "created_at", "updated_at", "firstName", "lastName", "email", "password", "campaignId")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        id,
        daysAgo(ageDays),
        daysAgo(ageDays),
        firstName,
        lastName,
        email,
        password,
        campaignId,
      ],
    );
  };

  await insertCustomer(
    IDS.membershipSamPreset,
    'Sam',
    'Foster',
    'sam@test.local',
    IDS.campaignPreset,
    6,
  );
  await insertCustomer(
    IDS.membershipSamSeasonal,
    'Sam',
    'Foster',
    'SAM@test.local',
    IDS.campaignSeasonalActive,
    3,
  );
  await insertCustomer(
    IDS.membershipTaylorExpired,
    'Taylor',
    'Parker',
    'taylor@test.local',
    IDS.campaignSeasonalExpired,
    2,
  );
  await insertCustomer(
    IDS.membershipJordanPreset,
    'Jordan',
    'Reed',
    'jordan@test.local',
    IDS.campaignPreset,
    1,
  );

  const insertPoints = async (
    id: string,
    points: number,
    description: string,
    campaignId: string,
    customerId: string,
    ageDays: number,
  ) => {
    await dataSource.query(
      `INSERT INTO "Customer points" ("id", "created_at", "updated_at", "points", "description", "campaignId", "customerId")
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, daysAgo(ageDays), daysAgo(ageDays), points, description, campaignId, customerId],
    );
  };

  await insertPoints(
    'b1b1b1b1-1111-4111-8111-111111111111',
    500,
    'Sign up reward',
    IDS.campaignPreset,
    IDS.membershipSamPreset,
    6,
  );
  await insertPoints(
    'b1b1b1b1-2222-4222-8222-222222222222',
    100,
    'Sign up reward',
    IDS.campaignSeasonalActive,
    IDS.membershipSamSeasonal,
    3,
  );
  await insertPoints(
    'b1b1b1b1-3333-4333-8333-333333333333',
    50,
    'Sign up reward',
    IDS.campaignSeasonalExpired,
    IDS.membershipTaylorExpired,
    2,
  );
  await insertPoints(
    'b1b1b1b1-4444-4444-8444-444444444444',
    200,
    'Sign up reward',
    IDS.campaignPreset,
    IDS.membershipJordanPreset,
    1,
  );

  await dataSource.query(
    `INSERT INTO "CustomersRewards"
       ("id", "created_at", "updated_at", "description", "uniqueCode", "campaignId", "customerId", "rewardId")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      'd2d2d2d2-1111-4111-8111-111111111111',
      daysAgo(1),
      daysAgo(1),
      'Free latte',
      'RDM-0001',
      IDS.campaignPreset,
      IDS.membershipSamPreset,
      IDS.reward1,
    ],
  );

  await dataSource.query(
    `INSERT INTO "Code Generated By Staffs"
       ("id", "created_at", "updated_at", "expiry", "points", "code", "type", "campaignId", "staffId")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      IDS.pointCode,
      daysAgo(1),
      daysAgo(1),
      daysAgo(-1),
      25,
      'POINT-CODE-1',
      '1',
      IDS.campaignPreset,
      IDS.staff1,
    ],
  );
  await dataSource.query(
    `INSERT INTO "Reward Merchant Codes"
       ("id", "created_at", "updated_at", "expiry", "code", "campaignId", "staffId", "rewardId")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      IDS.rewardCode,
      daysAgo(1),
      daysAgo(1),
      daysAgo(-1),
      'REWARD-CODE-1',
      IDS.campaignPreset,
      IDS.staff1,
      IDS.reward1,
    ],
  );
  await dataSource.query(
    `INSERT INTO "Customers Number"
       ("id", "created_at", "updated_at", "code", "type", "campaignId", "customerId")
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      IDS.customerNumber,
      daysAgo(1),
      daysAgo(1),
      'CUSTOMER-NUMBER-1',
      '1',
      IDS.campaignPreset,
      IDS.membershipSamPreset,
    ],
  );
  await dataSource.query(
    `INSERT INTO "Customers Reward Number"
       ("id", "created_at", "updated_at", "code", "type", "campaignId", "customerId")
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      IDS.rewardCustomerNumber,
      daysAgo(1),
      daysAgo(1),
      'REWARD-NUMBER-1',
      'QR',
      IDS.campaignPreset,
      IDS.membershipSamPreset,
    ],
  );
}
