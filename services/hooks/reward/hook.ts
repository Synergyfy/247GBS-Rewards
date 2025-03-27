import api, { setBearerToken } from '@/services/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CustomerNumberType,
  CustomerPointType,
  CustomerRedeemNumberType,
  GenerateCodeType,
  GenerateRewardCodeType,
  PointHistoryType,
  RewardHistoryType,
  RewardMethod,
  RewardType,
  ValidateCodeType,
} from './types';
import { getCookieValue } from '@/services/getCookieValue';

export const useCreateRewards = () => {
  const create = async (reward: RewardType) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.post(`reward/`, reward);
    const response = await request;
    return response['data'] as RewardType;
  };

  const mutation = useMutation({
    mutationFn: (reward: RewardType) => create(reward),
  });

  return mutation;
};

export const useGeneratePoint = () => {
  const create = async (generatePoint: GenerateCodeType) => {
    const accessToken: string = getCookieValue('staffToken') || '';
    setBearerToken(accessToken);
    const request = api.post(`reward/generate-code/`, {
      ...generatePoint,
    });
    const response = await request;
    return response['data'] as GenerateCodeType;
  };

  const mutation = useMutation({
    mutationFn: (generatePoint: GenerateCodeType) => create(generatePoint),
  });

  return mutation;
};

export const useGenerateRewardPoint = () => {
  const create = async (generatePoint: GenerateRewardCodeType) => {
    const accessToken: string = getCookieValue('staffToken') || '';
    setBearerToken(accessToken);
    const request = api.post(`reward/generate-redeem-code/`, {
      ...generatePoint,
    });
    const response = await request;
    return response['data'] as GenerateRewardCodeType;
  };

  const mutation = useMutation({
    mutationFn: (generatePoint: GenerateRewardCodeType) =>
      create(generatePoint),
  });

  return mutation;
};

export const useCustomerNumber = () => {
  const create = async (data: { campaignId: string; type: RewardMethod }) => {
    const accessToken: string = getCookieValue('customerToken') || '';
    setBearerToken(accessToken);
    const request = api.post(`reward/customer-number/`, { ...data });
    const response = await request;
    return response['data'] as GenerateCodeType;
  };

  const mutation = useMutation({
    mutationFn: create,
  });

  return mutation;
};

export const useCustomerRedeemNumber = () => {
  const create = async (campaignId: string, type: RewardMethod) => {
    const accessToken: string = getCookieValue('customerToken') || '';
    setBearerToken(accessToken);
    const request = api.post(`reward/customer-redeem-number/`, {
      campaignId,
      type,
    });
    const response = await request;
    return response['data'] as GenerateCodeType;
  };

  const mutation = useMutation({
    mutationFn: ({
      campaignId,
      type,
    }: {
      campaignId: string;
      type: RewardMethod;
    }) => create(campaignId, type),
  });

  return mutation;
};

export const useValidateCode = () => {
  const create = async (code: ValidateCodeType) => {
    const accessToken: string = getCookieValue('customerToken') || '';
    setBearerToken(accessToken);
    const request = api.post(`reward/verify-code/`, {
      ...code,
    });
    const response = await request;
    return response['data'] as ValidateCodeType;
  };

  const mutation = useMutation({
    mutationFn: (code: ValidateCodeType) => create(code),
  });

  return mutation;
};

export const useValidateRewardCode = () => {
  const create = async (code: ValidateCodeType) => {
    const accessToken: string = getCookieValue('customerToken') || '';
    setBearerToken(accessToken);
    const request = api.post(`reward/verify-redeem-code/`, {
      ...code,
    });
    const response = await request;
    return response['data'] as ValidateCodeType;
  };

  const mutation = useMutation({
    mutationFn: (code: ValidateCodeType) => create(code),
  });

  return mutation;
};

export const useValidatCustomerNumber = () => {
  const create = async (customerNumber: CustomerNumberType) => {
    const accessToken: string = getCookieValue('staffToken') || '';
    setBearerToken(accessToken);
    const request = api.post(`reward/validate-cutomer-number/`, {
      ...customerNumber,
    });
    const response = await request;
    return response['data'] as CustomerNumberType;
  };

  const mutation = useMutation({
    mutationFn: (customerNumber: CustomerNumberType) => create(customerNumber),
  });

  return mutation;
};

export const useValidatCustomerRedeemNumber = () => {
  const create = async (customerNumber: CustomerRedeemNumberType) => {
    const accessToken: string = getCookieValue('staffToken') || '';
    setBearerToken(accessToken);
    const request = api.post(`reward/validate-cutomer-redeem-number/`, {
      ...customerNumber,
    });
    const response = await request;
    return response['data'] as CustomerRedeemNumberType;
  };

  const mutation = useMutation({
    mutationFn: (customerNumber: CustomerRedeemNumberType) =>
      create(customerNumber),
  });

  return mutation;
};

export const useGetRewards = () => {
  const fetch = async () => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.get(`/reward/all-rewards/`);
    const response = await request;
    return response['data'] as RewardType[];
  };

  const query = useQuery({
    queryKey: ['rewards'],
    queryFn: fetch,
    refetchOnMount: 'always',
  });

  return query;
};

export const useGetCodes = (campaignId: string) => {
  const fetch = async () => {
    const accessToken: string = getCookieValue('staffToken') || '';
    setBearerToken(accessToken);
    const request = api.get(`/reward/all-campaigns/${campaignId}/`);
    const response = await request;
    return response['data'] as GenerateCodeType[];
  };

  const query = useQuery({
    queryKey: ['generatedcodes'],
    queryFn: fetch,
    refetchOnMount: 'always',
  });

  return query;
};
interface UpdateRewardType {
  id: string;
  reward: RewardType;
}

export const useUpdateReward = () => {
  const create = async ({ id, reward }: UpdateRewardType) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.patch(`reward/${id}`, reward);
    const response = await request;
    return response['data'] as RewardType;
  };

  const mutation = useMutation({
    mutationFn: ({ id, reward }: UpdateRewardType) => create({ id, reward }),
  });

  return mutation;
};

export const useDeleteReward = () => {
  const deleteReward = async (rewardId: string) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.delete(`reward/${rewardId}`);
    const response = await request;
    return response['data'];
  };

  const mutation = useMutation({
    mutationFn: (rewardId: string) => deleteReward(rewardId),
  });

  return mutation;
};

// get campaign points for customer
export const useGetCampaignPoints = (campaignId: string) => {
  const fetch = async () => {
    const accessToken: string = getCookieValue('customerToken') || '';
    setBearerToken(accessToken);
    const request = api.get(`/reward/all-points/${campaignId}/`);
    const response = await request;
    return response['data'] as CustomerPointType[];
  };

  const query = useQuery({
    queryKey: ['customer points'],
    queryFn: fetch,
    refetchOnMount: 'always',
  });

  return query;
};

export const useGetPointsHistory = (campaignId: string) => {
  const fetch = async () => {
    const accessToken: string = getCookieValue('customerToken') || '';
    setBearerToken(accessToken);
    const request = api.get(`/reward/all-customer-points/${campaignId}`);
    const response = await request;
    return response['data'] as PointHistoryType[];
  };

  const query = useQuery({
    queryKey: ['pointHistory'],
    queryFn: fetch,
    refetchOnMount: 'always',
  });

  return query;
};

export const useGetCampaignPointsHistory = (campaignId: string) => {
  const fetch = async () => {
    const accessToken: string = getCookieValue('staffToken') || '';
    setBearerToken(accessToken);
    const request = api.get(`/reward/all-campaign-points/${campaignId}`);
    const response = await request;
    return response['data'] as PointHistoryType[];
  };

  const query = useQuery({
    queryKey: ['CampaignPointHistory'],
    queryFn: fetch,
    refetchOnMount: 'always',
  });

  return query;
};

export const useGetRewardHistory = (campaignId: string) => {
  const fetch = async () => {
    const accessToken: string = getCookieValue('customerToken') || '';
    setBearerToken(accessToken);
    const request = api.get(`/reward/all-redeem-points/${campaignId}`);
    const response = await request;
    return response['data'] as RewardHistoryType[];
  };

  const query = useQuery({
    queryKey: ['rewardHistory'],
    queryFn: fetch,
    refetchOnMount: 'always',
  });

  return query;
};

export const useGetCampaignRewardHistory = (campaignId: string) => {
  const fetch = async () => {
    const accessToken: string = getCookieValue('staffToken') || '';
    setBearerToken(accessToken);
    const request = api.get(`/reward/all-campaign-redeem/${campaignId}`);
    const response = await request;
    return response['data'] as RewardHistoryType[];
  };

  const query = useQuery({
    queryKey: ['rewardHistory'],
    queryFn: fetch,
    refetchOnMount: 'always',
  });

  return query;
};

export const useGetPointBalance = (campaignId: string) => {
  const fetch = async () => {
    const accessToken: string = getCookieValue('customerToken') || '';
    setBearerToken(accessToken);
    const request = api.get(`/reward/points-balance/${campaignId}`);
    const response = await request;
    return response['data'] as number;
  };

  const query = useQuery({
    queryKey: ['pointBalance'],
    queryFn: fetch,
    refetchOnMount: 'always',
  });

  return query;
};
