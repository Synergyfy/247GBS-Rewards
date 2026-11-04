import type { AuditLogEntry, Business, Campaign, Customer, PointsLedgerEntry, Redemption, Reward, Staff, User } from '../types';

const names = ['Maya Chen', 'Oliver Grant', 'Sofia Patel', 'Ethan Walker', 'Amara Okafor', 'Noah Kim', 'Isabella Rossi', 'Liam Brooks', 'Zara Ahmed', 'Mateo Silva', 'Ava Wilson', 'Theo Martin', 'Nia Johnson', 'Leo Anders', 'Priya Shah', 'Felix Morgan', 'Aisha Khan', 'Max Turner', 'Elena Cruz', 'Kai Thompson', 'Grace Lee', 'Daniel Price', 'Mila Novak', 'Arjun Rao', 'Hana Sato'];
const brands = ['Northstar Coffee', 'Fieldwork Market', 'Juniper House', 'Common Ground', 'Studio Sunday', 'Goodfolk Goods', 'Harvest & Co', 'Bluebird Supply', 'The Local Edit', 'Paper & Pine', 'Poppy Lane', 'Morrow Bakery', 'Cedar & Stone', 'Daytrip Outfitters', 'Little Acre', 'Brightside Books', 'Forma Studio', 'Everwell Kitchen', 'Driftwood Roasters', 'Kindred Table', 'Atlas Goods', 'Olive & Oak', 'Westward Cycle', 'Soft Hours', 'Copperline'];
const cities = ['Austin', 'Portland', 'Chicago', 'Brooklyn', 'Denver', 'Atlanta', 'Seattle', 'San Diego'];
const rewards = ['Free latte', '10% off next visit', 'Gift card', 'Member tote', 'Seasonal pastry', 'Double points day'];
const isoDaysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
const makeBase = (i: number, age = i % 160) => ({ id: `00000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`, created_at: isoDaysAgo(age), updated_at: isoDaysAgo(Math.max(0, age - 2)) });
const pick = <T,>(values: readonly T[], index: number): T => { const value = values[index]; if (value === undefined) throw new Error('Fixture collection is unexpectedly empty.'); return value; };

export interface MockStore {
  admins: User[]; businesses: Business[]; campaigns: Campaign[]; customers: Customer[];
  ledger: PointsLedgerEntry[]; redemptions: Redemption[];
  staff: Staff[]; audit: AuditLogEntry[];
}

export function createFixtures(): MockStore {
  const admins: User[] = names.map((fullName, i) => ({
    ...makeBase(i + 1, 150 - i * 4), fullName, email: `${fullName.toLowerCase().replaceAll(' ', '.')}@example.com`,
    role: 'admin', phoneNumber: `+1 512 555 ${String(1000 + i).slice(-4)}`, location: pick(cities, i % cities.length),
    signupSource: i % 5 === 0 ? 'stock_audit' : 'mcom', isActive: i % 9 !== 0,
  }));
  const businesses: Business[] = Array.from({ length: 40 }, (_, i) => ({
    ...makeBase(100 + i, 130 - (i % 100)), name: pick(brands, i % brands.length), logo: null,
    email: `hello@${pick(brands, i % brands.length).toLowerCase().replaceAll(/[^a-z]+/g, '')}.example`,
    phoneNumber: `+1 512 555 ${String(2000 + i).slice(-4)}`, website: `https://${pick(brands, i % brands.length).toLowerCase().replaceAll(/[^a-z]+/g, '')}.example`,
    user: pick(admins, i % admins.length), address: { ...makeBase(300 + i), street: `${100 + i} Market St`, postalCode: `78${String(i).padStart(3, '0')}`, city: pick(cities, i % cities.length), state: 'TX' },
    links: [{ ...makeBase(400 + i), text: 'Website', url: `https://${pick(brands, i % brands.length).toLowerCase().replaceAll(/[^a-z]+/g, '')}.example` }],
  }));
  const campaigns: Campaign[] = Array.from({ length: 80 }, (_, i) => {
    const business = pick(businesses, i % businesses.length);
    const type = pick(['PRESET', 'CO_BRANDED', 'SEASONAL'] as const, i % 3);
    const season = type === 'SEASONAL' ? { ...makeBase(500 + i), name: 'Summer season', startDate: isoDaysAgo(20), endDate: new Date(Date.now() + (i % 4 === 0 ? -2 : 45) * 86400000).toISOString() } : null;
    const active = type !== 'SEASONAL' || Boolean(season && new Date() >= new Date(season.startDate) && new Date() <= new Date(season.endDate));
    return {
      ...makeBase(600 + i, 110 - (i % 100)), type, name: `${pick(['Summer Rewards', 'Member Circle', 'Good Neighbor', 'Weekend Perks'], i % 4)} ${i + 1}`,
      startDate: isoDaysAgo(65), endDate: null, signupPoints: String(20 + (i % 4) * 10), customDomain: null, uniqueCode: `CAMP${String(i + 1).padStart(4, '0')}`,
      earnStaffScanQR: i % 2 === 0, earnEnterCode: i % 3 === 0, earnStaffPersonalCode: true, earnGiveStaffNumber: false,
      redeemStaffScanQR: i % 2 !== 0, redeemStaffPersonalCode: true, redeemGiveStaffNumber: false,
      homeTitle: 'Rewards made local', homeText: 'Earn points every time you shop.', headerImg: null,
      background: '#ffffff', text: '#111827', primaryBg: '#2d3dff', primaryText: '#ffffff', secondaryBg: '#eef0fe', secondaryText: '#2d3dff',
      business, season, isActive: active, rewards: Array.from({ length: 2 }, (_, rewardIndex): Reward => ({ ...makeBase(12000 + i * 2 + rewardIndex, 20 + i % 60), title: pick(rewards, (i + rewardIndex) % rewards.length), pointCost: String(200 + rewardIndex * 150), currency: 'points', rewardValue: rewardIndex === 0 ? '£5' : 'Free item', activeFrom: isoDaysAgo(30), expires: new Date(Date.now() + 120 * 86400000).toISOString(), description: 'A member-only reward from this campaign.', type: 'STANDARD', successPageTitle: null, successPageMessage: null, successPageButtonLink: null, config: null, quantityAvailable: 500, quantityRemaining: 350 - i % 180 })),
    };
  });
  const customers: Customer[] = Array.from({ length: 2000 }, (_, i) => {
    const firstName = pick(['Sam', 'Taylor', 'Jordan', 'Alex', 'Morgan', 'Riley', 'Casey', 'Jamie', 'Robin', 'Cameron'], i % 10);
    const lastName = pick(['Foster', 'Parker', 'Reed', 'Bailey', 'Morgan', 'Ellis', 'Kelly', 'Rivera'], i % 8);
    const campaign = pick(campaigns, i % campaigns.length);
    return { ...makeBase(1000 + i, i % 360), firstName, lastName, email: `customer${String(i + 1).padStart(4, '0')}@mail.example`, campaign, balance: 80 + (i * 37) % 1800 };
  });
  const ledger: PointsLedgerEntry[] = Array.from({ length: 900 }, (_, i) => {
    const customer = pick(customers, (i * 17) % customers.length);
    const campaign = customer.campaign;
    const isRedeem = i % 7 === 0;
    return { ...makeBase(4000 + i, i % 90), points: isRedeem ? -100 - (i % 5) * 50 : 20 + (i % 9) * 10, description: isRedeem ? 'Reward redemption' : pick(['Purchase scanned', 'Welcome bonus', 'Staff QR earn', 'Campaign milestone'], i % 4), customer, campaign };
  });
  const redemptions: Redemption[] = Array.from({ length: 140 }, (_, i) => {
    const customer = pick(customers, (i * 13) % customers.length);
    return { ...makeBase(6000 + i, i % 80), description: pick(rewards, i % rewards.length), uniqueCode: `RDM${String(i + 1).padStart(6, '0')}`, customer, campaign: customer.campaign };
  });
  const staff: Staff[] = Array.from({ length: 58 }, (_, i) => {
    const name = pick(names, i % names.length);
    return { ...makeBase(8000 + i, i % 100), name: `${name.split(' ')[0]} Staff`, email: `staff${i + 1}@example.com`, avatar: null, isActive: i % 8 !== 0, business: pick(businesses, i % businesses.length) };
  });
  const audit: AuditLogEntry[] = Array.from({ length: 160 }, (_, i) => {
    const actor = pick(admins, i % admins.length);
    const targetType = pick(['user', 'business', 'campaign', 'customer'] as const, i % 4);
    const target = targetType === 'user' ? pick(admins, i % admins.length) : targetType === 'business' ? pick(businesses, i % businesses.length) : targetType === 'campaign' ? pick(campaigns, i % campaigns.length) : pick(customers, i % customers.length);
    return { ...makeBase(9000 + i, i % 45), actor: { id: actor.id, fullName: actor.fullName, email: actor.email }, action: pick(['user.status_changed', 'points.adjusted', 'campaign.updated', 'business.created', 'payment.reviewed'], i % 5), targetType, targetId: target.id, payload: { source: 'admin-console', note: i % 3 === 0 ? 'Support request' : 'Routine review' }, ip: `192.168.1.${10 + i % 220}` };
  });
  return { admins, businesses, campaigns, customers, ledger, redemptions, staff, audit };
}
