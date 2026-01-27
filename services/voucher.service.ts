import axios from 'axios';

export const MCOM_BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
export const MCOM_LOYALTY_API_URL = process.env.NEXT_PUBLIC_MCOM_LOYALTY_API_URL || 'http://localhost:3000/api/v1';
export const MCOM_MALL_API_URL = process.env.NEXT_PUBLIC_MCOM_MALL_API_URL || 'http://localhost:3001/api/v1';

export enum VoucherType {
  LINK = "LINK",
  CREDENTIALS = "CREDENTIALS",
  MCOM_LOYALTY_TIER = "MCOM_LOYALTY_TIER",
  MCOM_MALL_TIER = "MCOM_MALL_TIER"
}

export interface CreateVoucherBatchDto {
  type: VoucherType;
  count: number;
  config: any;
  validityDays: number;
}

export const voucherService = {
  async generateBatch(dto: CreateVoucherBatchDto) {
    const response = await axios.post(`${MCOM_BACKEND_URL}/vouchers/generate`, dto);
    return response.data;
  },

  async findAll() {
    const response = await axios.get(`${MCOM_BACKEND_URL}/vouchers`);
    return response.data;
  },

  async redeem(code: string) {
    const response = await axios.post(`${MCOM_BACKEND_URL}/vouchers/redeem`, { code });
    return response.data;
  },

  async fetchLoyaltyTiers() {
    const response = await axios.get(`${MCOM_LOYALTY_API_URL}/tier`);
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  },

  async fetchMallTiers() {
    const response = await axios.get(`${MCOM_MALL_API_URL}/tiers`);
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  }
};
