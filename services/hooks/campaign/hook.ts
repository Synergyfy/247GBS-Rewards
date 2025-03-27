import api, { setBearerToken } from '@/services/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CampaignType } from './types';
import { getCookieValue } from '@/services/getCookieValue';

export const useCreateCampaign = () => {
  const create = async (campaign: CampaignType) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.post(`campaign/`, campaign);
    const response = await request;
    return response['data'] as CampaignType;
  };

  const mutation = useMutation({
    mutationFn: (campaign: CampaignType) => create(campaign),
  });

  return mutation;
};

export const useGetCampaigns = () => {
  const fetch = async () => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.get(`/campaign/all-campaigns/`);
    const response = await request;
    return response['data'] as CampaignType[];
  };

  const query = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetch,
    refetchOnMount: 'always',
  });

  return query;
};

export const useGetCampaign = (code: string) => {
  const fetch = async () => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.get(`/campaign/${code}/`);
    const response = await request;
    return response['data'] as CampaignType;
  };

  const query = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetch,
    refetchOnMount: 'always',
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
interface UpdateCampaignType {
  id: string;
  campaign: CampaignType;
}

export const useUpdateCampaign = () => {
  const create = async ({ id, campaign }: UpdateCampaignType) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.patch(`campaign/${id}`, campaign);
    const response = await request;
    return response['data'] as CampaignType;
  };

  const mutation = useMutation({
    mutationFn: ({ id, campaign }: UpdateCampaignType) =>
      create({ id, campaign }),
  });

  return mutation;
};

export const useDeleteCampaign = () => {
  const deleteReward = async (campaignId: string) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.delete(`campaign/${campaignId}`);
    const response = await request;
    return response['data'];
  };

  const mutation = useMutation({
    mutationFn: (campaignId: string) => deleteReward(campaignId),
  });

  return mutation;
};
