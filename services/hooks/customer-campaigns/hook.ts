import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { getCookieValue } from '@/services/getCookieValue';
import {
    JoinCampaignResponse,
    IsJoinedResponse,
    ParticipantBalance,
    ClaimCodePayload,
    ClaimCodeResponse,
    UniqueCodeResponse,
    ParticipantHistoryResponse,
    RedeemRewardPayload,
    RedeemRewardResponse
} from './types';

const PARTICIPANT_BALANCE_QUERY_KEY = 'participantBalance';
const UNIQUE_CODE_QUERY_KEY = 'uniqueCode';

// This function helps ensure we have the right token (customer token)
const getHeaders = () => {
    const token = getCookieValue('customerToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Join Campaign
export const useJoinCampaign = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (campaignId: string) => {
            const { data } = await api.post<JoinCampaignResponse & { token?: string }>('/customer/join-campaign', { campaignId }, getHeaders());
            // Update token if new identity provided
            if (data.token) {
                const isSecure = window.location.protocol === 'https:';
                const cookieString = `max-age=86400; path=/; ${isSecure ? 'secure;' : ''}`;
                document.cookie = `customerToken=${data.token}; ${cookieString}`;
            }
            return data;
        },
        onSuccess: (_, campaignId) => {
            queryClient.invalidateQueries({ queryKey: ['isJoined', campaignId] });
            queryClient.invalidateQueries({ queryKey: [PARTICIPANT_BALANCE_QUERY_KEY, campaignId] });
        },
    });
};

// Check Join Status
export const useCheckCampaignJoinStatus = (campaignId: string) => {
    const token = typeof window !== 'undefined' ? getCookieValue('customerToken') : null;
    return useQuery({
        queryKey: ['isJoined', campaignId],
        queryFn: async () => {
            const { data } = await api.get<IsJoinedResponse & { token?: string }>('/customer/is-joined', {
                ...getHeaders(),
                params: { campaignId }
            });
            
            // Auto-switch token if backend returns a campaign-specific token
            if (data.token && data.token !== token) {
                const isSecure = window.location.protocol === 'https:';
                const cookieString = `max-age=86400; path=/; ${isSecure ? 'secure;' : ''}`;
                document.cookie = `customerToken=${data.token}; ${cookieString}`;
                // Reload page to apply new token to subsequent queries? 
                // Or just let React Query refetch naturally if invalidation occurs.
                // ideally we should trigger a refetch of balance/history.
            }
            return data;
        },
        enabled: !!campaignId && !!token,
        retry: false,
    });
};

// Get Unique Code for QR
export const useGetUniqueCode = () => {
    return useQuery({
        queryKey: [UNIQUE_CODE_QUERY_KEY],
        queryFn: async () => {
            const { data } = await api.get<UniqueCodeResponse>('/auth/unique-code', getHeaders());
            return data;
        },
    });
};

// Get Participant Balance
export const useGetParticipantBalance = (campaignId: string) => {
    const token = typeof window !== 'undefined' ? getCookieValue('customerToken') : null;
    return useQuery({
        queryKey: [PARTICIPANT_BALANCE_QUERY_KEY, campaignId, token],
        queryFn: async () => {
            const { data } = await api.get<number>(`/reward/points-balance/${campaignId}`, getHeaders());
            // mcom_backend returns raw number
            return {
                campaignId,
                campaignName: '',
                balance: data,
                stampBalance: 0
            } as ParticipantBalance;
        },
        enabled: !!campaignId && !!token,
    });
};

// Claim Code
export const useClaimCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: ClaimCodePayload) => {
            // mcom_backend uses /reward/verify-code ? No, that's verifying. 
            // mcom_backend might not have claim-code logic identical to McomLoyaltyAPI.
            // Assuming /reward/redeem-self-service logic covers redemption. 
            // Claiming points? /reward/verify-code returns points. 
            // If the user manually enters a code to get points:
            const { data } = await api.post<ClaimCodeResponse>('/reward/verify-code', { ...payload, code: payload.code, type: '1' }, getHeaders());
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [PARTICIPANT_BALANCE_QUERY_KEY, variables.campaignId] });
        },
    });
};

// Get History
export const useGetParticipantHistory = (campaignId: string, page: number = 1, limit: number = 10) => {
    const token = typeof window !== 'undefined' ? getCookieValue('customerToken') : null;
    return useQuery({
        queryKey: ['participantHistory', campaignId, page, limit, token],
        queryFn: async () => {
            // mcom_backend endpoint returns array
            const { data } = await api.get<any[]>(`/reward/all-customer-points/${campaignId}`, {
                ...getHeaders(),
                params: { page, limit }
            });
            
            // Map mcom_backend entity to frontend type
            const mappedData: any[] = data.map(item => ({
                id: item.id,
                createdAt: item.created_at, // Adjust field name based on backend entity
                type: 'EARN', // mcom_backend points are usually earns. Redeems are separate?
                points: item.points,
                description: item.description,
            }));

            return {
                data: mappedData,
                total: data.length, // mcom_backend doesn't paginate yet?
                page,
                limit
            } as ParticipantHistoryResponse;
        },
        enabled: !!campaignId && !!token,
    });
};

// Redeem Reward
export const useRedeemReward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: RedeemRewardPayload) => {
            const { data } = await api.post<RedeemRewardResponse>('/reward/redeem-self-service', payload, getHeaders());
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [PARTICIPANT_BALANCE_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: ['participantHistory'] });
        },
    });
};
