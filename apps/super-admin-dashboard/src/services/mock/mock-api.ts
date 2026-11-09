import { appEnv } from '@/lib/env';
import { createMockToken } from '@/lib/session';
import { sortByField } from '@/lib/sort';
import { daysIn, resolveRange } from '@/lib/date-range';
import type { SuperAdminApi } from '../api';
import { createFixtures } from './fixtures';
import type {
  AuditListParams, AuditLogEntry, Business, BusinessCreateInput, BusinessListParams, CampaignCode, CampaignCodeKind,
  CampaignAnalytics, CampaignListParams, Customer, CustomerListParams, CustomerRow, ListParams, Paginated,
  PlatformAnalytics, PointsAdjustmentInput, PointsLedgerEntry,
  RedemptionListParams, User, UserAnalytics, UserListParams, UserRow,
} from '../types';

const store = createFixtures();
const codeKinds: CampaignCodeKind[] = ['point_code', 'reward_code', 'reward_number', 'customer_number'];
// A few issued codes per campaign and kind, shaped like GET campaigns/:id/codes rows
let codes: Array<CampaignCode & { campaignId: string }> = store.campaigns.flatMap((campaign, c) => codeKinds.flatMap((kind, k) => Array.from({ length: 3 }, (_, i) => {
  const staffMember = store.staff.find((member) => member.business?.id === campaign.business?.id);
  const customer = store.customers.find((row) => row.campaign?.id === campaign.id);
  const reward = campaign.rewards?.[0];
  const isCode = kind === 'point_code' || kind === 'reward_code';
  return {
    id: crypto.randomUUID(), campaignId: campaign.id, kind,
    created_at: new Date(Date.now() - (c * 7 + k * 3 + i) * 3600000).toISOString(),
    code: `${kind.split('_').map((part) => part[0]!.toUpperCase()).join('')}-${String(1000 + c * 31 + k * 7 + i)}`,
    expiry: isCode ? new Date(Date.now() + (i + 1) * 86400000).toISOString() : null,
    points: kind === 'point_code' ? 10 * (i + 1) : null,
    staff: isCode && staffMember ? { id: staffMember.id, label: staffMember.name } : null,
    customer: !isCode && customer ? { id: customer.id, label: `${customer.firstName} ${customer.lastName}` } : null,
    reward: kind === 'reward_code' && reward ? { id: reward.id, label: reward.title } : null,
  };
})));
const actor = { id: '00000000-0000-4000-8000-999999999999', fullName: 'Super Admin', email: 'super@247gbs.test' };
const pause = async () => {
  await new Promise((resolve) => window.setTimeout(resolve, 330 + Math.random() * 230));
  if (appEnv.MOCK_ERROR === '403' || appEnv.MOCK_ERROR === '500') {
    const status = Number(appEnv.MOCK_ERROR);
    throw Object.assign(new Error(status === 403 ? 'You do not have permission to view this section.' : 'Fixture server error. Try again.'), { status });
  }
};
function page<T>(items: T[], params: ListParams = {}): Paginated<T> {
  let rows = [...items];
  if (params.search) {
    const term = params.search.toLocaleLowerCase();
    rows = rows.filter((row) => JSON.stringify(row).toLocaleLowerCase().includes(term));
  }
  if (params.sort) {
    const key = params.sort;
    rows = sortByField(rows, key, params.order);
  }
  const current = Math.max(1, Number(params.page ?? 1));
  const limit = Math.max(1, Number(params.limit ?? 25));
  return { data: rows.slice((current - 1) * limit, current * limit), total: rows.length, page: current, limit };
}
/** Collapse campaign memberships into one row per person (email, case-insensitive). */
function personRow(rows: Customer[]): CustomerRow {
  const newest = [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const latest = newest[0]!;
  const memberships = newest.map((row) => ({ id: row.id, created_at: row.created_at, balance: row.balance ?? 0, campaign: row.campaign }));
  return {
    id: newest[newest.length - 1]!.id, firstName: latest.firstName, lastName: latest.lastName, email: latest.email,
    created_at: newest[newest.length - 1]!.created_at, balance: memberships.reduce((sum, item) => sum + item.balance, 0),
    campaignCount: memberships.length, memberships,
  };
}
function groupByPerson(rows: Customer[]): CustomerRow[] {
  const people = new Map<string, Customer[]>();
  for (const row of rows) {
    const key = row.email.toLocaleLowerCase();
    const list = people.get(key);
    if (list) list.push(row); else people.set(key, [row]);
  }
  return [...people.values()].map(personRow);
}
function userRow(user: User): UserRow {
  const businesses = store.businesses.filter((business) => business.user?.id === user.id);
  const campaignIds = store.campaigns.filter((campaign) => businesses.some((business) => business.id === campaign.business?.id));
  const customers = store.customers.filter((customer) => campaignIds.some((campaign) => campaign.id === customer.campaign?.id));
  return { ...user, businessCount: businesses.length, campaignCount: campaignIds.length, customerCount: customers.length };
}
function required<T>(rows: T[], predicate: (row: T) => boolean, name: string): T {
  const result = rows.find(predicate);
  if (!result) throw Object.assign(new Error(`${name} not found.`), { status: 404 });
  return result;
}
function record(action: string, targetType: AuditLogEntry['targetType'], targetId: string, payload: Record<string, unknown> | null): void {
  store.audit.unshift({ id: crypto.randomUUID(), created_at: new Date().toISOString(), actor, action, targetType, targetId, payload, ip: '127.0.0.1' });
}
function userWithBusinesses(user: User): User & { businesses: Business[] } {
  return { ...user, businesses: store.businesses.filter((business) => business.user?.id === user.id) };
}
export const mockApi: SuperAdminApi = {
  async login(email, password) {
    await pause();
    if (email === 'super@247gbs.test' && password === 'password') return { accessToken: createMockToken('super_admin', email), name: 'Super Admin', role: 'super_admin' };
    // A valid non-super-admin login, like the real API returns: the login page must reject it by role
    if (email === 'admin@247gbs.test' && password === 'password') return { accessToken: createMockToken('admin', email), name: 'Business Admin', role: 'admin' };
    // Same shape the real API's PasswordFieldsDontMatch / UserDoesNotExist errors normalize to
    throw Object.assign(new Error('Invalid email or password.'), { status: 400 });
  },
  async listAdmins(params) { await pause(); return page(store.admins.map(userRow), params); },
  async listUsers(params: UserListParams) {
    await pause();
    let rows = store.admins.map(userRow);
    if (params.role) rows = rows.filter((user) => user.role === params.role);
    if (params.signupSource) rows = rows.filter((user) => user.signupSource === params.signupSource);
    if (params.isActive !== undefined) rows = rows.filter((user) => (user.isActive ?? true) === params.isActive);
    return page(rows, params);
  },
  async getUser(id) { await pause(); return userWithBusinesses(required(store.admins, (item) => item.id === id, 'User')); },
  async updateUser(id, input) {
    await pause(); const user = required(store.admins, (item) => item.id === id, 'User'); Object.assign(user, input, { updated_at: new Date().toISOString() });
    record('user.updated', 'user', id, input); return user;
  },
  async setUserStatus(id, isActive, reason) {
    await pause(); const user = required(store.admins, (item) => item.id === id, 'User'); user.isActive = isActive; user.updated_at = new Date().toISOString();
    record('user.status_changed', 'user', id, { isActive, reason: reason ?? 'Status update' }); return user;
  },
  async resetPassword(id, reason) {
    await pause(); required(store.admins, (item) => item.id === id, 'User'); record('user.password_reset', 'user', id, { reason });
    return { temporaryPassword: `GBS-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}` };
  },
  async deleteUser(id, reason) {
    await pause(); required(store.admins, (item) => item.id === id, 'User'); store.admins = store.admins.filter((user) => user.id !== id); record('user.deleted', 'user', id, { reason }); return { success: true };
  },
  async listBusinesses(params: BusinessListParams) {
    await pause(); let rows = [...store.businesses]; if (params.userId) rows = rows.filter((business) => business.user?.id === params.userId); return page(rows, params);
  },
  async getBusiness(id) {
    await pause(); const business = required(store.businesses, (item) => item.id === id, 'Business');
    return { ...business, campaigns: store.campaigns.filter((campaign) => campaign.business?.id === id), staffs: store.staff.filter((member) => member.business?.id === id), segments: [{ id: 'segment-a', name: 'Frequent visitors', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }], seasons: store.campaigns.flatMap((campaign) => campaign.business?.id === id && campaign.season ? [campaign.season] : []) };
  },
  async createBusiness(ownerId, input: BusinessCreateInput) {
    await pause(); const user = required(store.admins, (item) => item.id === ownerId, 'Owner');
    const business: Business = { id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), name: input.name, logo: input.logo ?? null, email: input.email, phoneNumber: input.phoneNumber, website: input.website ?? null, user };
    store.businesses.unshift(business); record('business.created', 'business', business.id, { name: business.name, ownerId }); return business;
  },
  async updateBusiness(id, input) {
    await pause(); const business = required(store.businesses, (item) => item.id === id, 'Business'); Object.assign(business, input, { updated_at: new Date().toISOString() }); record('business.updated', 'business', id, { name: business.name }); return business;
  },
  async deleteBusiness(id, reason) {
    await pause(); required(store.businesses, (item) => item.id === id, 'Business');
    const campaignIds = store.campaigns.filter((campaign) => campaign.business?.id === id).map((campaign) => campaign.id);
    store.businesses = store.businesses.filter((business) => business.id !== id);
    store.campaigns = store.campaigns.filter((campaign) => campaign.business?.id !== id);
    store.customers = store.customers.filter((customer) => !campaignIds.includes(customer.campaign?.id ?? ''));
    store.staff = store.staff.filter((member) => member.business?.id !== id);
    record('business.deleted', 'business', id, { reason, cascadedCampaigns: campaignIds.length }); return { success: true };
  },
  async businessStaff(id) { await pause(); return store.staff.filter((member) => member.business?.id === id); },
  async updateStaff(id, input) { await pause(); const member = required(store.staff, (row) => row.id === id, 'Staff'); Object.assign(member, input); return member; },
  async listCampaigns(params: CampaignListParams) {
    await pause(); let rows = [...store.campaigns];
    if (params.businessId) rows = rows.filter((campaign) => campaign.business?.id === params.businessId);
    if (params.userId) rows = rows.filter((campaign) => campaign.business?.user?.id === params.userId);
    if (params.type) rows = rows.filter((campaign) => campaign.type === params.type);
    if (params.active !== undefined) rows = rows.filter((campaign) => campaign.isActive === params.active);
    return page(rows, params);
  },
  async getCampaign(id) { await pause(); return required(store.campaigns, (item) => item.id === id, 'Campaign'); },
  async setCampaignStatus(id, isActive, reason) {
    await pause(); const campaign = required(store.campaigns, (item) => item.id === id, 'Campaign'); campaign.isActive = isActive; record('campaign.status_changed', 'campaign', id, { isActive, reason }); return campaign;
  },
  async listCampaignCodes(id, params) {
    await pause(); required(store.campaigns, (item) => item.id === id, 'Campaign');
    const kind = params.kind ?? 'point_code';
    const rows: CampaignCode[] = codes.filter((row) => row.campaignId === id && row.kind === kind);
    return page(rows, { sort: 'created_at', order: 'DESC', ...params });
  },
  async userAnalytics(id): Promise<UserAnalytics> {
    await pause(); const businesses = store.businesses.filter((business) => business.user?.id === id);
    const campaigns = store.campaigns.filter((campaign) => businesses.some((business) => business.id === campaign.business?.id));
    const customers = store.customers.filter((customer) => campaigns.some((campaign) => campaign.id === customer.campaign?.id));
    return { totalCampaigns: campaigns.length, activeCampaigns: campaigns.filter((campaign) => campaign.isActive).length, inactiveCampaigns: campaigns.filter((campaign) => !campaign.isActive).length, totalCustomers: customers.length, totalPointsIssued: customers.reduce((sum, customer) => sum + (customer.balance ?? 0), 0), totalRewardsRedeemed: store.redemptions.filter((redeem) => campaigns.some((campaign) => campaign.id === redeem.campaign?.id)).length };
  },
  async businessAnalytics(id): Promise<UserAnalytics> {
    await pause(); required(store.businesses, (item) => item.id === id, 'Business');
    const campaigns = store.campaigns.filter((campaign) => campaign.business?.id === id);
    const customers = store.customers.filter((customer) => campaigns.some((campaign) => campaign.id === customer.campaign?.id));
    return { totalCampaigns: campaigns.length, activeCampaigns: campaigns.filter((campaign) => campaign.isActive).length, inactiveCampaigns: campaigns.filter((campaign) => !campaign.isActive).length, totalCustomers: customers.length, totalPointsIssued: customers.reduce((sum, customer) => sum + (customer.balance ?? 0), 0), totalRewardsRedeemed: store.redemptions.filter((redeem) => campaigns.some((campaign) => campaign.id === redeem.campaign?.id)).length };
  },
  async campaignAnalytics(id): Promise<CampaignAnalytics> {
    await pause(); const campaign = required(store.campaigns, (item) => item.id === id, 'Campaign');
    const customers = store.customers.filter((customer) => customer.campaign?.id === id);
    const activity = Array.from({ length: 7 }, (_, i) => ({ date: new Date(Date.now() - (6 - i) * 86400000).toISOString().slice(0, 10), count: 20 + (i * 13) % 50 }));
    return { campaignName: campaign.name, isActive: campaign.isActive ?? true, totalCustomers: customers.length, totalPointsIssued: customers.reduce((sum, customer) => sum + (customer.balance ?? 0), 0), totalRewardsRedeemed: store.redemptions.filter((item) => item.campaign?.id === id).length, pointsActivity: activity, rewardsActivity: activity.map((point) => ({ ...point, count: Math.round(point.count / 8) })) };
  },
  async platformAnalytics(from?: string, to?: string): Promise<PlatformAnalytics> {
    await pause();
    // Honors the from/to contract; each day's figures derive from the date so they're stable across reloads
    const series = daysIn(resolveRange(from, to)).map((date) => {
      const n = Math.floor(Date.parse(date) / 86400000);
      return { date, newUsers: 4 + (n * 7) % 12, newCustomers: 33 + (n * 29) % 80, pointsIssued: 2200 + (n * 347) % 2600, redemptions: 15 + (n * 13) % 40 };
    });
    const pointsIssued = store.customers.reduce((sum, customer) => sum + (customer.balance ?? 0), 0);
    return { totals: { users: store.admins.length, usersByRole: { super_admin: 1, admin: store.admins.length, staff: store.staff.length, customer: store.customers.length }, usersBySignupSource: { mcom: store.admins.filter((user) => user.signupSource === 'mcom').length, stock_audit: store.admins.filter((user) => user.signupSource === 'stock_audit').length }, businesses: store.businesses.length, campaigns: store.campaigns.length, activeCampaigns: store.campaigns.filter((campaign) => campaign.isActive).length, customers: store.customers.length, pointsIssued, pointsRedeemed: Math.abs(store.ledger.filter((entry) => entry.points < 0).reduce((sum, entry) => sum + entry.points, 0)), rewardsRedeemed: store.redemptions.length }, series, topBusinesses: store.businesses.slice(0, 5).map((business) => ({ businessId: business.id, name: business.name, ownerName: business.user?.fullName ?? '—', customers: store.customers.filter((customer) => store.campaigns.some((campaign) => campaign.business?.id === business.id && campaign.id === customer.campaign?.id)).length, pointsIssued: 4200 + business.id.charCodeAt(35) * 120 })) };
  },
  async listCustomers(params: CustomerListParams) {
    await pause(); let rows = [...store.customers];
    if (params.campaignId) rows = rows.filter((customer) => customer.campaign?.id === params.campaignId);
    if (params.businessId) rows = rows.filter((customer) => customer.campaign?.business?.id === params.businessId);
    return page(groupByPerson(rows), params);
  },
  async getCustomer(id) {
    await pause(); const customer = required(store.customers, (item) => item.id === id, 'Customer');
    const email = customer.email.toLocaleLowerCase();
    const memberships = store.customers.filter((item) => item.email.toLocaleLowerCase() === email);
    const ids = new Set(memberships.map((item) => item.id));
    return { ...personRow(memberships), ledger: store.ledger.filter((entry) => entry.customer && ids.has(entry.customer.id)), redemptions: store.redemptions.filter((item) => item.customer && ids.has(item.customer.id)) };
  },
  async adjustCustomerPoints(id, input: PointsAdjustmentInput) {
    await pause(); const customer = required(store.customers, (item) => item.id === id, 'Customer'); customer.balance = (customer.balance ?? 0) + input.points;
    const entry: PointsLedgerEntry = { id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), points: input.points, description: input.reason, customer, campaign: required(store.campaigns, (campaign) => campaign.id === input.campaignId, 'Campaign') };
    store.ledger.unshift(entry); record('points.adjusted', 'customer', id, { points: input.points, reason: input.reason, campaignId: input.campaignId }); return entry;
  },
  async listRedemptions(params: RedemptionListParams) {
    await pause(); let rows = [...store.redemptions];
    if (params.campaignId) rows = rows.filter((entry) => entry.campaign?.id === params.campaignId);
    if (params.customerId) rows = rows.filter((entry) => entry.customer?.id === params.customerId);
    return page(rows, params);
  },
  async revokeCode(id, reason) {
    await pause(); const code = required(codes, (row) => row.id === id, 'Code'); codes = codes.filter((row) => row.id !== id);
    record('code.revoked', 'code', id, { code: code.code, kind: code.kind, reason, note: reason ?? 'Code revoked' }); return { success: true };
  },
  async listAuditLogs(params: AuditListParams) {
    await pause(); let rows = [...store.audit];
    if (params.actorId) rows = rows.filter((entry) => entry.actor?.id === params.actorId);
    if (params.targetType) rows = rows.filter((entry) => entry.targetType === params.targetType);
    if (params.targetId) rows = rows.filter((entry) => entry.targetId === params.targetId);
    return page(rows, params);
  },
};
