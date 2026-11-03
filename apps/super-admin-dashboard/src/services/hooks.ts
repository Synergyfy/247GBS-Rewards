import { keepPreviousData, useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { superAdminApi } from './index';
import { queryKeys } from './query-keys';
import { isNotAvailable } from '@/lib/errors';
import type { ListParams, UserListParams, BusinessListParams, CampaignListParams, CustomerListParams, TransactionListParams, PaymentListParams, AuditListParams, PointsAdjustmentInput } from './types';

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
export const useTransactions = (params: TransactionListParams) => useQuery({ queryKey: queryKeys.transactions(params), queryFn: () => superAdminApi.listTransactions(params), placeholderData: keepPreviousData });
export const useRedemptions = (params: TransactionListParams) => useQuery({ queryKey: queryKeys.redemptions(params), queryFn: () => superAdminApi.listRedemptions(params), placeholderData: keepPreviousData });
// Campaigns across several businesses (an admin's Campaigns tab). The §7.2 contract filters by businessId
// only, so this issues one list call per business and merges the results.
export function useCampaignsForBusinesses(businessIds: string[]) {
  return useQueries({
    queries: businessIds.map((businessId) => {
      const params = { businessId, page: 1, limit: 100 };
      return { queryKey: queryKeys.campaigns(params), queryFn: () => superAdminApi.listCampaigns(params) };
    }),
    combine: (results) => ({
      data: results.flatMap((result) => result.data?.data ?? []),
      isLoading: results.some((result) => result.isLoading),
      error: (results.find((result) => result.error)?.error ?? null) as Error | null,
      refetch: () => results.forEach((result) => void result.refetch()),
    }),
  });
}
export interface EntitySearchGroup<T> {
  items: T[];
  isLoading: boolean;
  /** The backend route for this group isn't implemented yet (real-API mode). */
  notAvailable: boolean;
  error: Error | null;
}
// ⌘K palette (§9B): one small search per entity type. Each group fails independently, so a
// TODO-BACKEND list that isn't built yet doesn't break the whole search.
export function useEntitySearch(term: string) {
  const enabled = term.trim().length >= 2;
  const params = { search: term.trim(), page: 1, limit: 5 };
  const toGroup = <T,>(result: { data?: { data: T[] }; isLoading: boolean; error: unknown }): EntitySearchGroup<T> => ({
    items: result.data?.data ?? [],
    isLoading: enabled && result.isLoading,
    notAvailable: isNotAvailable(result.error),
    error: result.error && !isNotAvailable(result.error) ? (result.error as Error) : null,
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
export const usePayments = (params: PaymentListParams) => useQuery({ queryKey: queryKeys.payments(params), queryFn: () => superAdminApi.listPayments(params), placeholderData: keepPreviousData });
export const useAuditLogs = (params: AuditListParams) => useQuery({ queryKey: queryKeys.audit(params), queryFn: () => superAdminApi.listAuditLogs(params), placeholderData: keepPreviousData });
export const useUserAnalytics = (id: string) => useQuery({ queryKey: queryKeys.adminAnalytics(id), queryFn: () => superAdminApi.userAnalytics(id), enabled: Boolean(id) });
export const useCampaignAnalytics = (id: string) => useQuery({ queryKey: queryKeys.campaignAnalytics(id), queryFn: () => superAdminApi.campaignAnalytics(id), enabled: Boolean(id) });
export const useUserPayments = (id: string) => useQuery({ queryKey: queryKeys.userPayments(id), queryFn: () => superAdminApi.userPayments(id), enabled: Boolean(id) });
export const useUserBalances = (id: string) => useQuery({ queryKey: queryKeys.userBalances(id), queryFn: () => superAdminApi.userBalances(id), enabled: Boolean(id) });

export function useSetUserStatus() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, active, reason }: { id: string; active: boolean; reason?: string }) => superAdminApi.setUserStatus(id, active, reason), onSuccess: async (_, variables) => { await Promise.all([client.invalidateQueries({ queryKey: ['admins'] }), client.invalidateQueries({ queryKey: queryKeys.user(variables.id) })]); toast.success(variables.active ? 'Account activated' : 'Account deactivated', { description: 'Change recorded in the audit trail.' }); }, onError: () => toast.error('Could not update account status.') });
}
export function useAdjustPoints() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: PointsAdjustmentInput }) => superAdminApi.adjustCustomerPoints(id, input), onSuccess: async (_, variables) => { await Promise.all([client.invalidateQueries({ queryKey: queryKeys.customer(variables.id) }), client.invalidateQueries({ queryKey: ['transactions'] })]); toast.success('Points adjustment recorded'); }, onError: () => toast.error('Could not adjust points.') });
}
export function useSetCampaignStatus() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, active, reason }: { id: string; active: boolean; reason?: string }) => superAdminApi.setCampaignStatus(id, active, reason), onSuccess: async (_, variables) => { await Promise.all([client.invalidateQueries({ queryKey: ['campaigns'] }), client.invalidateQueries({ queryKey: queryKeys.campaign(variables.id) })]); toast.success('Campaign status updated'); }, onError: () => toast.error('Could not update campaign status.') });
}
