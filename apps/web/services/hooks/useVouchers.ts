import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MCOM_BACKEND_URL, CreateVoucherBatchDto, VoucherType } from '../voucher.service';
import { getCookieValue } from '../getCookieValue';

// Query to Fetch All Vouchers
export const useVouchers = () => {
  return useQuery({
    queryKey: ['vouchers'],
    queryFn: async () => {
      const token = getCookieValue('token');
      const response = await axios.get(`${MCOM_BACKEND_URL}/vouchers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    },
  });
};

// Mutation to Generate Vouchers
export const useGenerateVouchers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateVoucherBatchDto) => {
      const token = getCookieValue('token');
      const response = await axios.post(`${MCOM_BACKEND_URL}/vouchers/generate`, dto, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    },
    onSuccess: () => {
      // Refresh the list after generation
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
    },
  });
};

// Mutation to Redeem a Voucher (Public Endpoint)
export const useRedeemVoucher = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const response = await axios.post(`${MCOM_BACKEND_URL}/vouchers/redeem`, { code });
      return response.data;
    },
  });
};
