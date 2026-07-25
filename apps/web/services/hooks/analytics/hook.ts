import api, { setBearerToken } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { getCookieValue } from '@/services/getCookieValue';
import { CampaignAnalytics, RewardStats } from './types';

export const useGetRewardStats = (rewardId: string) => {
    const fetchStats = async () => {
        const accessToken: string = getCookieValue('token') || '';
        setBearerToken(accessToken);
        const response = await api.get(`/reward/${rewardId}/stats`);
        return response.data as RewardStats;
    };

    return useQuery({
        queryKey: ['reward-stats', rewardId],
        queryFn: fetchStats,
        enabled: !!rewardId,
        refetchOnMount: 'always',
    });
};

export const useGetCampaignAnalytics = (campaignId: string) => {
    const fetchAnalytics = async () => {
        const accessToken: string = getCookieValue('token') || '';
        setBearerToken(accessToken);
        const response = await api.get(`/analytics/campaign/${campaignId}`);
        return response.data as CampaignAnalytics;
    };

    return useQuery({
        queryKey: ['campaign-analytics', campaignId],
        queryFn: fetchAnalytics,
        enabled: !!campaignId,
        refetchOnMount: 'always',
    });
};
