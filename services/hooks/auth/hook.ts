import api, { setBearerToken } from '@/services/api';
import { getCookieValue } from '@/services/getCookieValue';
import { useMutation } from '@tanstack/react-query';

interface authType {
  email: string;
  password: string;
}

interface signupType {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  referralCode: string;
}

interface signupCustomerType {
  fullName: string;
  email: string;
  password: string;
  password2: string;
}

export interface authDataType {
  accessToken: string;
}

export interface authCustomerType extends authType {
  campaignId: string;
}

export interface errorType {
  response: { data: { status: number; error: string } };
}

export const useAuth = () => {
  const create = async ({ email, password }: authType) => {
    const request = api.post(`auth/`, { email, password });
    const response = await request;
    return response['data'] as authDataType;
  };

  const mutation = useMutation({
    mutationFn: ({ email, password }: authType) => create({ email, password }),
  });

  return mutation;
};

export const useSignup = () => {
  const create = async (user: signupType) => {
    const request = api.post(`user/`, { ...user });
    const response = await request;
    return response['data'];
  };

  const mutation = useMutation({
    mutationFn: (user: signupType) => create({ ...user }),
  });

  return mutation;
};

export const useAuthCustomer = () => {
  const create = async ({ email, password, campaignId }: authCustomerType) => {
    const request = api.post(`auth/customer`, { email, password, campaignId });
    const response = await request;
    return response['data'] as authDataType;
  };

  const mutation = useMutation({
    mutationFn: ({ email, password, campaignId }: authCustomerType) =>
      create({ email, password, campaignId }),
  });

  return mutation;
};

export const useAuthStaff = () => {
  const create = async ({ email, password }: authType) => {
    const request = api.post(`auth/staff`, { email, password });
    const response = await request;
    return response['data'] as authDataType;
  };

  const mutation = useMutation({
    mutationFn: ({ email, password }: authType) => create({ email, password }),
  });

  return mutation;
};

export const useSignupCustomer = (campaignId: string) => {
  const create = async (customer: signupCustomerType) => {
    const request = api.post(`customer/`, { ...customer, campaignId });
    const response = await request;
    return response['data'];
  };

  const mutation = useMutation({
    mutationFn: (customer: signupCustomerType) => create({ ...customer }),
  });

  return mutation;
};

export const useCreateSSOEntry = () => {
  const create = async () => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.post(`auth/sso-business/`);
    const response = await request;
    return response['data'] as string;
  };

  const mutation = useMutation({
    mutationFn: create,
  });

  return mutation;
};
