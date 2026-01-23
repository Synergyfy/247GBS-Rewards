import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MCOM_LOYALTY_API_URL, MCOM_MALL_API_URL } from '../voucher.service';

export const useLoyaltyTiers = () => {
  return useQuery({
    queryKey: ['loyaltyTiers'],
    queryFn: async () => {
      // Endpoint: http://localhost:3000/api/v1/tier
      const url = `${MCOM_LOYALTY_API_URL}/tier`;
      console.log(`[Hooks] Fetching Loyalty Tiers from: ${url}`);
      
      try {
        const response = await axios.get(url);
        // Handle { data: [...] } or [...]
        return Array.isArray(response.data) ? response.data : response.data.data || [];
      } catch (error: any) {
        console.error(`[Hooks] Loyalty Fetch Error:`, error.message);
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};

export const useMallTiers = () => {
  return useQuery({
    queryKey: ['mallTiers'],
    queryFn: async () => {
      // Endpoint: http://localhost:3001/api/v1/tiers
      const url = `${MCOM_MALL_API_URL}/tiers`;
      console.log(`[Hooks] Fetching Mall Tiers from: ${url}`);

      try {
        const response = await axios.get(url);
        return Array.isArray(response.data) ? response.data : response.data.data || [];
      } catch (error: any) {
        console.error(`[Hooks] Mall Fetch Error:`, error.message);
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};
