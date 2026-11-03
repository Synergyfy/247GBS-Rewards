import { http } from './http';
import { ENDPOINTS } from './endpoints';
import { NotImplementedError } from '@/lib/errors';
import { sortByField } from '@/lib/sort';
import type { SuperAdminApi } from './api';
import type { ListParams, Paginated, PlatformAnalytics, User, UserRow } from './types';

function pageOf<T>(items: T[], params: ListParams = {}): Paginated<T> {
  const page = Math.max(1, Number(params.page ?? 1));
  const limit = Math.max(1, Number(params.limit ?? 25));
  let rows = [...items];
  if (params.search) {
    const search = params.search.toLowerCase();
    rows = rows.filter((row) => Object.values(row as object).some((value) => typeof value === 'string' && value.toLowerCase().includes(search)));
  }
  const total = rows.length;
  const field = params.sort;
  if (field) rows = sortByField(rows, field, params.order);
  return { data: rows.slice((page - 1) * limit, page * limit), total, page, limit };
}
function userRow(user: User): UserRow { return { ...user, businessCount: user.businesses?.length ?? 0, campaignCount: 0, customerCount: 0 }; }
// NestJS answers an unknown route with 404 "Cannot GET /path"; a missing record on a route that
// exists answers 404 with its own message (e.g. "User not found"). Only the former means the
// TODO-BACKEND contract isn't implemented yet; the latter must surface as a normal not-found error.
function isMissingRoute(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('status' in error)) return false;
  const status = Number((error as { status: unknown }).status);
  const message = 'message' in error ? String((error as { message: unknown }).message) : '';
  return status === 405 || (status === 404 && /^Cannot (GET|POST|PUT|PATCH|DELETE) \//.test(message));
}
function missingContract<T>(request: Promise<T>): Promise<T> {
  return request.catch((error: unknown) => {
    if (isMissingRoute(error)) throw new NotImplementedError();
    throw error;
  });
}
async function getArray<T>(url: string, params: unknown = {}): Promise<T[]> {
  const response = await http.get<T[] | Paginated<T>>(url, { params });
  return Array.isArray(response.data) ? response.data : response.data.data;
}
// ADAPTER: remove when backend paginates. Existing APIs return arrays; filter/page in this app.
async function adaptedList<T>(url: string, params: ListParams, map: (row: T) => T = (row) => row): Promise<Paginated<T>> {
  return pageOf((await getArray<T>(url)).map(map), params);
}
// TODO-BACKEND lists: same adapter, but a missing route renders NotAvailableYet
function todoList<T>(url: string, params: ListParams): Promise<Paginated<T>> {
  return missingContract(adaptedList<T>(url, params));
}
export const realApi: SuperAdminApi = {
  async login(email, password) { return (await http.post(ENDPOINTS.login, { email, password })).data; },
  async listAdmins(params) { return adaptedList(ENDPOINTS.admins, params, (user: User) => userRow(user)); },
  async listUsers(params) { return adaptedList(ENDPOINTS.users, params, (user: User) => userRow(user)); },
  async getUser(id) { return (await missingContract(http.get(ENDPOINTS.user(id)))).data; },
  async createUser(input) { return (await http.post(ENDPOINTS.createUser, input)).data; },
  async updateUser(id, input) { return (await missingContract(http.patch(ENDPOINTS.user(id), input))).data; },
  async setUserStatus(id, isActive, reason) { return (await missingContract(http.patch(ENDPOINTS.userStatus(id), { isActive, reason }))).data; },
  async resetPassword(id, reason) { return (await missingContract(http.post(ENDPOINTS.resetPassword(id), { reason })).then((response) => response.data)); },
  async deleteUser(id, reason) { return (await missingContract(http.delete(ENDPOINTS.deleteUser(id), { data: { reason } })).then((response) => response.data)); },
  async impersonate(id, reason) { return (await missingContract(http.post(ENDPOINTS.impersonate(id), { reason })).then((response) => response.data)); },
  async userPayments(id) { return (await missingContract(http.get(ENDPOINTS.userPayments(id))).then((response) => response.data)); },
  async userBalances(id) { return (await missingContract(http.get(ENDPOINTS.userBalances(id))).then((response) => response.data)); },
  async listBusinesses(params) { return todoList(ENDPOINTS.businesses, params); },
  async getBusiness(id) { return (await missingContract(http.get(ENDPOINTS.business(id)))).data; },
  async createBusiness(ownerId, input) { return (await http.post(ENDPOINTS.createBusiness(ownerId), input)).data; },
  async updateBusiness(id, input) { return (await http.patch(ENDPOINTS.business(id), input)).data; }, // EXISTS
  async deleteBusiness(id, reason) { return (await http.delete(ENDPOINTS.deleteBusiness(id), { data: { reason } })).data; },
  async businessStaff(id) { return (await http.get(ENDPOINTS.businessStaff(id))).data; },
  async updateStaff(id, input) { return (await missingContract(http.patch(ENDPOINTS.staff(id), input))).data; },
  async listCampaigns(params) { return todoList(ENDPOINTS.campaigns, params); },
  async getCampaign(id) { return (await missingContract(http.get(ENDPOINTS.campaign(id)))).data; },
  async setCampaignStatus(id, isActive, reason) { return (await missingContract(http.patch(ENDPOINTS.campaignStatus(id), { isActive, reason }))).data; },
  async userAnalytics(id) { return (await http.get(ENDPOINTS.userAnalytics(id))).data; },
  async campaignAnalytics(id) { return (await http.get(ENDPOINTS.campaignAnalytics(id))).data; },
  async platformAnalytics(from, to) {
    const { data } = await missingContract(http.get<PlatformAnalytics | { message: string }>(ENDPOINTS.platformAnalytics, { params: { from, to } }));
    // The backend route exists but is a stub that answers 200 { message } until implemented
    if (!('totals' in data)) throw new NotImplementedError();
    return data;
  },
  async listCustomers(params) { return todoList(ENDPOINTS.customers, params); },
  async getCustomer(id) { return (await missingContract(http.get(ENDPOINTS.customer(id)))).data; },
  async adjustCustomerPoints(id, input) { return (await missingContract(http.post(ENDPOINTS.pointsAdjustment(id), input))).data; },
  async listTransactions(params) { return todoList(ENDPOINTS.transactions, params); },
  async listRedemptions(params) { return todoList(ENDPOINTS.redemptions, params); },
  async revokeCode(id) { return (await missingContract(http.delete(ENDPOINTS.revokeCode(id))).then((response) => response.data)); },
  async listPayments(params) { return todoList(ENDPOINTS.payments, params); },
  async listAuditLogs(params) { return todoList(ENDPOINTS.auditLogs, params); },
};
