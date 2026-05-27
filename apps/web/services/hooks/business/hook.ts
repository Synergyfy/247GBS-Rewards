import {
  BusinessType,
  SegmentType,
  StaffType,
} from '@/app/interfaces/business.type';
import api, { setBearerToken } from '@/services/api';
import { getCookieValue } from '@/services/getCookieValue';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCreateBusiness = () => {
  const create = async (business: BusinessType) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.post(`business/`, business);
    const response = await request;
    return response['data'] as BusinessType;
  };

  const mutation = useMutation({
    mutationFn: (business: BusinessType) => create(business),
  });

  return mutation;
};

export const useCreateStaff = () => {
  const create = async (staff: StaffType) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.post(`staff/`, staff);
    const response = await request;
    return response['data'] as StaffType;
  };

  const mutation = useMutation({
    mutationFn: (staff: StaffType) => create(staff),
  });

  return mutation;
};

export const useCreateSegment = () => {
  const create = async (staff: SegmentType) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.post(`segment/`, staff);
    const response = await request;
    return response['data'] as SegmentType;
  };

  const mutation = useMutation({
    mutationFn: (staff: SegmentType) => create(staff),
  });

  return mutation;
};

interface FetchBusiness extends BusinessType {
  id: string;
}

export const useGetBusiness = () => {
  const fetch = async () => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.get(`/business/all-businesses/`);
    const response = await request;
    return response['data'] as FetchBusiness[];
  };

  const query = useQuery({
    queryKey: ['businesses'],
    queryFn: fetch,
    refetchOnMount: 'always',
  });

  return query;
};

export const useGetStaffs = () => {
  const fetch = async () => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.get(`/staff/all-staffs/`);
    const response = await request;
    return response['data'] as StaffType[];
  };

  const query = useQuery({
    queryKey: ['staffs'],
    queryFn: fetch,
    refetchOnMount: 'always',
  });

  return query;
};

export const useGetSegments = () => {
  const fetch = async () => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.get(`/segment/all-segments/`);
    const response = await request;
    return response['data'] as SegmentType[];
  };

  const query = useQuery({
    queryKey: ['segments'],
    queryFn: fetch,
    refetchOnMount: 'always',
  });

  return query;
};

//DELETE

export const useDeleteBusiness = () => {
  const deleteBusiness = async (businessId: string) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.delete(`business/${businessId}`);
    const response = await request;
    return response['data'] as BusinessType;
  };

  const mutation = useMutation({
    mutationFn: (businessId: string) => deleteBusiness(businessId),
  });

  return mutation;
};

export const useDeleteStaff = () => {
  const deleteStaff = async (staffId: string) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.delete(`staff/${staffId}`);
    const response = await request;
    return response['data'] as BusinessType;
  };

  const mutation = useMutation({
    mutationFn: (staffId: string) => deleteStaff(staffId),
  });

  return mutation;
};

export const useDeleteSegment = () => {
  const deleteStaff = async (segmentId: string) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.delete(`segment/${segmentId}`);
    const response = await request;
    return response['data'] as SegmentType;
  };

  const mutation = useMutation({
    mutationFn: (segmentId: string) => deleteStaff(segmentId),
  });

  return mutation;
};

interface UpdateBusinessType {
  id: string;
  business: BusinessType;
}
export const useUpdateBusiness = () => {
  const create = async ({ id, business }: UpdateBusinessType) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.patch(`business/${id}`, business);
    const response = await request;
    return response['data'] as BusinessType;
  };

  const mutation = useMutation({
    mutationFn: ({ id, business }: UpdateBusinessType) =>
      create({ id, business }),
  });

  return mutation;
};

interface UpdateStaffType {
  id: string;
  staff: StaffType;
}

export const useUpdateStaff = () => {
  const create = async ({ id, staff }: UpdateStaffType) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.patch(`staff/${id}`, staff);
    const response = await request;
    return response['data'] as StaffType;
  };

  const mutation = useMutation({
    mutationFn: ({ id, staff }: UpdateStaffType) => create({ id, staff }),
  });

  return mutation;
};

interface UpdateSegmentType {
  id: string;
  segment: SegmentType;
}

export const useUpdateSegment = () => {
  const create = async ({ id, segment }: UpdateSegmentType) => {
    const accessToken: string = getCookieValue('token') || '';
    setBearerToken(accessToken);
    const request = api.patch(`segment/${id}`, segment);
    const response = await request;
    return response['data'] as SegmentType;
  };

  const mutation = useMutation({
    mutationFn: ({ id, segment }: UpdateSegmentType) => create({ id, segment }),
  });

  return mutation;
};
