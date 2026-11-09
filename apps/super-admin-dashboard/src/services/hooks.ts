import { keepPreviousData, useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { superAdminApi } from './index';
import { queryKeys } from './query-keys';
import type { ListParams, UserListParams, BusinessListParams, CampaignListParams, CustomerListParams, RedemptionListParams, AuditListParams, PointsAdjustmentInput, CampaignCodeListParams, BusinessUpdateInput, StaffUpdateInput } from './types';

export const usePlatformAnalytics = (from?: string, to?: string) => useQuery({ queryKey: queryKeys.analytics(from, to), queryFn: () => superAdminApi.platformAnalytics(from, to) });
export const useAdmins = (params: ListParams) => useQuery({ queryKey: queryKeys.admins(params), queryFn: () => superAdminApi.listAdmins(params), placeholderData: keepPreviousData });
export const useUsers = (params: UserListParams) => useQuery({ queryKey: queryKeys.users(params), queryFn: () => superAdminApi.listUsers(params), placeholderData: keepPreviousData });
export const useUser = (id: string) => useQuery({ queryKey: queryKeys.user(id), queryFn: () => superAdminApi.getUser(id), enabled: Boolean(id) });
export const useBusinesses = (params: BusinessListParams) => useQuery({ queryKey: queryKeys.businesses(params), queryFn: () => superAdminApi.listBusinesses(params), placeholderData: keepPreviousData });
export const useBusiness = (id: string) => useQuery({ queryKey: queryKeys.business(id), queryFn: () => superAdminApi.getBusiness(id), enabled: Boolean(id) });
export const useCampaigns = (params: CampaignListParams) => useQuery({ queryKey: queryKeys.campaigns(params), queryFn: () => superAdminApi.listCampaigns(params), placeholderData: keepPreviousData });
export const useCampaign = (id: string) => useQuery({ queryKey: queryKeys.campaign(id), queryFn: () => superAdminApi.getCampaign(id), enabled: Boolean(id) });
export const useCustomers = (params: CustomerListParams) => useQuery({ queryKey: queryKeys.customers(params), queryFn: () => superAdminApi.listCustomers(params), placeholderData: keepPreviousData });
export const useCustomer = (id: string) => useQuery({ queryKey: queryKeys.customer(id), queryFn: () => superAdminApi.getCustomer(id), enabled: Boolean(id) });
export const useCampaignCodes = (id: string, params: CampaignCodeListParams) => useQuery({ queryKey: queryKeys.campaignCodes(id, params), queryFn: () => superAdminApi.listCampaignCodes(id, params), enabled: Boolean(id), placeholderData: keepPreviousData });
export const useRedemptions = (params: RedemptionListParams) => useQuery({ queryKey: queryKeys.redemptions(params), queryFn: () => superAdminApi.listRedemptions(params), placeholderData: keepPreviousData });
export interface EntitySearchGroup<T> {
  items: T[];
  isLoading: boolean;
  error: Error | null;
}
// ⌘K palette (§9B): one small search per entity type. Each group fails independently.
export function useEntitySearch(term: string) {
  const enabled = term.trim().length >= 2;
  const params = { search: term.trim(), page: 1, limit: 5 };
  const toGroup = <T,>(result: { data?: { data: T[] }; isLoading: boolean; error: unknown }): EntitySearchGroup<T> => ({
    items: result.data?.data ?? [],
    isLoading: enabled && result.isLoading,
    error: (result.error as Error | null) ?? null,
  });
  const [admins, businesses, campaigns, customers] = useQueries({
    queries: [
      { queryKey: queryKeys.admins(params), queryFn: () => superAdminApi.listAdmins(params), enabled, retry: false },
      { queryKey: queryKeys.businesses(params), queryFn: () => superAdminApi.listBusinesses(params), enabled, retry: false },
      { queryKey: queryKeys.campaigns(params), queryFn: () => superAdminApi.listCampaigns(params), enabled, retry: false },
      { queryKey: queryKeys.customers(params), queryFn: () => superAdminApi.listCustomers(params), enabled, retry: false },
    ],
  });
  return {
    enabled,
    admins: toGroup(admins),
    businesses: toGroup(businesses),
    campaigns: toGroup(campaigns),
    customers: toGroup(customers),
  };
}
export const useAuditLogs = (params: AuditListParams) => useQuery({ queryKey: queryKeys.audit(params), queryFn: () => superAdminApi.listAuditLogs(params), placeholderData: keepPreviousData });
export const useUserAnalytics = (id: string) => useQuery({ queryKey: queryKeys.adminAnalytics(id), queryFn: () => superAdminApi.userAnalytics(id), enabled: Boolean(id) });
export const useBusinessAnalytics = (id: string) => useQuery({ queryKey: queryKeys.businessAnalytics(id), queryFn: () => superAdminApi.businessAnalytics(id), enabled: Boolean(id) });
export const useCampaignAnalytics = (id: string) => useQuery({ queryKey: queryKeys.campaignAnalytics(id), queryFn: () => superAdminApi.campaignAnalytics(id), enabled: Boolean(id) });

export function useSetUserStatus() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, active, reason }: { id: string; active: boolean; reason?: string }) => superAdminApi.setUserStatus(id, active, reason), onSuccess: async (_, variables) => { await Promise.all([client.invalidateQueries({ queryKey: ['admins'] }), client.invalidateQueries({ queryKey: queryKeys.user(variables.id) })]); toast.success(variables.active ? 'Account activated' : 'Account deactivated', { description: 'Change recorded in the audit trail.' }); }, onError: () => toast.error('Could not update account status.') });
}
export function useAdjustPoints() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: PointsAdjustmentInput }) => superAdminApi.adjustCustomerPoints(id, input), onSuccess: async () => { await Promise.all([client.invalidateQueries({ queryKey: ['customer'] }), client.invalidateQueries({ queryKey: ['customers'] })]); toast.success('Points adjustment recorded'); }, onError: () => toast.error('Could not adjust points.') });
}
export function useSetCampaignStatus() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, active, reason }: { id: string; active: boolean; reason?: string }) => superAdminApi.setCampaignStatus(id, active, reason), onSuccess: async (_, variables) => { await Promise.all([client.invalidateQueries({ queryKey: ['campaigns'] }), client.invalidateQueries({ queryKey: queryKeys.campaign(variables.id) })]); toast.success('Campaign status updated'); }, onError: () => toast.error('Could not update campaign status.') });
}
const errorMessage = (error: unknown, fallback: string) => (error instanceof Error && error.message ? error.message : fallback);
export function useUpdateUser() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: Parameters<typeof superAdminApi.updateUser>[1] }) => superAdminApi.updateUser(id, input), onSuccess: async (_, variables) => { await Promise.all([client.invalidateQueries({ queryKey: queryKeys.user(variables.id) }), client.invalidateQueries({ queryKey: ['admins'] }), client.invalidateQueries({ queryKey: ['users'] })]); toast.success('Admin details updated'); }, onError: (error) => toast.error(errorMessage(error, 'Could not update admin.')) });
}
export function useUpdateBusiness() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: BusinessUpdateInput }) => superAdminApi.updateBusiness(id, input), onSuccess: async (_, variables) => { await Promise.all([client.invalidateQueries({ queryKey: queryKeys.business(variables.id) }), client.invalidateQueries({ queryKey: ['businesses'] }), client.invalidateQueries({ queryKey: ['user'] })]); toast.success('Business updated'); }, onError: (error) => toast.error(errorMessage(error, 'Could not update business.')) });
}
export function useUpdateStaff(businessId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: StaffUpdateInput }) => superAdminApi.updateStaff(id, input), onSuccess: async (staff, variables) => { await client.invalidateQueries({ queryKey: queryKeys.business(businessId) }); toast.success(variables.input.isActive === undefined ? 'Staff member updated' : `${staff.name} ${staff.isActive ? 'activated' : 'deactivated'}`); }, onError: (error) => toast.error(errorMessage(error, 'Could not update staff member.')) });
}
export function useRevokeCode(campaignId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, reason }: { id: string; reason: string }) => superAdminApi.revokeCode(id, reason), onSuccess: async () => { await client.invalidateQueries({ queryKey: ['campaign-codes', campaignId] }); toast.success('Code revoked', { description: 'Change recorded in the audit trail.' }); }, onError: (error) => toast.error(errorMessage(error, 'Could not revoke code.')) });
}
