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
            const { data } = await api.post<JoinCampaignResponse>('/participant/join-campaign', { campaignId }, getHeaders());
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
    return useQuery({
        queryKey: ['isJoined', campaignId],
        queryFn: async () => {
            const { data } = await api.get<IsJoinedResponse>('/participant-campaign-balance/is-joined', {
                ...getHeaders(),
                params: { campaignId }
            });
            return data;
        },
        enabled: !!campaignId,
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
    return useQuery({
        queryKey: [PARTICIPANT_BALANCE_QUERY_KEY, campaignId],
        queryFn: async () => {
            const { data } = await api.get<ParticipantBalance>(`/participant-campaign-balance/my-balance/${campaignId}`, getHeaders());
            return data;
        },
        enabled: !!campaignId,
    });
};

// Claim Code
export const useClaimCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: ClaimCodePayload) => {
            const { data } = await api.post<ClaimCodeResponse>('/participant-campaign-balance/claim-code', payload, getHeaders());
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [PARTICIPANT_BALANCE_QUERY_KEY, variables.campaignId] });
        },
    });
};

// Get History
export const useGetParticipantHistory = (campaignId: string, page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['participantHistory', campaignId, page, limit],
        queryFn: async () => {
            const { data } = await api.get<ParticipantHistoryResponse>(`/participant-campaign-balance/history/${campaignId}`, {
                ...getHeaders(),
                params: { page, limit }
            });
            return data;
        },
        enabled: !!campaignId,
    });
};

// Redeem Reward
export const useRedeemReward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: RedeemRewardPayload) => {
            const { data } = await api.post<RedeemRewardResponse>('/participant-campaign-balance/redeem-reward', payload, getHeaders());
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [PARTICIPANT_BALANCE_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: ['participantHistory'] });
        },
    });
};
