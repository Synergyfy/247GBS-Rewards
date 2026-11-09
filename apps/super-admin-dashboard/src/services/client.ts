import { http } from './http';
import { ENDPOINTS } from './endpoints';
import type { SuperAdminApi } from './api';

// Every list endpoint paginates, filters and sorts server-side and answers `Paginated<T>`.
const get = async <T,>(url: string, params?: object): Promise<T> => (await http.get<T>(url, { params })).data;

export const realApi: SuperAdminApi = {
  async login(email, password) { return (await http.post(ENDPOINTS.login, { email, password })).data; },
  listAdmins: (params) => get(ENDPOINTS.admins, params),
  listUsers: (params) => get(ENDPOINTS.users, params),
  getUser: (id) => get(ENDPOINTS.user(id)),
  async updateUser(id, input) { return (await http.patch(ENDPOINTS.user(id), input)).data; },
  async setUserStatus(id, isActive, reason) { return (await http.patch(ENDPOINTS.userStatus(id), { isActive, reason })).data; },
  async resetPassword(id, reason) { return (await http.post(ENDPOINTS.resetPassword(id), { reason })).data; },
  async deleteUser(id, reason) { return (await http.delete(ENDPOINTS.user(id), { data: { reason } })).data; },
  listBusinesses: (params) => get(ENDPOINTS.businesses, params),
  getBusiness: (id) => get(ENDPOINTS.business(id)),
  async createBusiness(ownerId, input) { return (await http.post(ENDPOINTS.createBusiness(ownerId), input)).data; },
  async updateBusiness(id, input) { return (await http.patch(ENDPOINTS.business(id), input)).data; },
  async deleteBusiness(id, reason) { return (await http.delete(ENDPOINTS.business(id), { data: { reason } })).data; },
  businessStaff: (id) => get(ENDPOINTS.businessStaff(id)),
  async updateStaff(id, input) { return (await http.patch(ENDPOINTS.staff(id), input)).data; },
  listCampaigns: (params) => get(ENDPOINTS.campaigns, params),
  getCampaign: (id) => get(ENDPOINTS.campaign(id)),
  async setCampaignStatus(id, isActive, reason) { return (await http.patch(ENDPOINTS.campaignStatus(id), { isActive, reason })).data; },
  listCampaignCodes: (id, params) => get(ENDPOINTS.campaignCodes(id), params),
  userAnalytics: (id) => get(ENDPOINTS.userAnalytics(id)),
  businessAnalytics: (id) => get(ENDPOINTS.businessAnalytics(id)),
  campaignAnalytics: (id) => get(ENDPOINTS.campaignAnalytics(id)),
  platformAnalytics: (from, to) => get(ENDPOINTS.platformAnalytics, { from, to }),
  listCustomers: (params) => get(ENDPOINTS.customers, params),
  getCustomer: (id) => get(ENDPOINTS.customer(id)),
  async adjustCustomerPoints(id, input) { return (await http.post(ENDPOINTS.pointsAdjustment(id), input)).data; },
  listRedemptions: (params) => get(ENDPOINTS.redemptions, params),
  async revokeCode(id, reason) { return (await http.delete(ENDPOINTS.revokeCode(id), { data: { reason } })).data; },
  listAuditLogs: (params) => get(ENDPOINTS.auditLogs, params),
};
