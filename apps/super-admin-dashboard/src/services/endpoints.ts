export const ENDPOINTS = {
  login: 'auth/', // EXISTS
  admins: 'super-admin/admins', // EXISTS
  users: 'super-admin/users', // EXISTS (array) → TODO-BACKEND (paginated)
  user: (id: string) => `super-admin/users/${id}`, // TODO-BACKEND
  userStatus: (id: string) => `super-admin/users/${id}/status`, // TODO-BACKEND
  resetPassword: (id: string) => `super-admin/users/${id}/reset-password`, // TODO-BACKEND
  deleteUser: (id: string) => `super-admin/users/${id}`, // TODO-BACKEND
  impersonate: (id: string) => `super-admin/users/${id}/impersonate`, // TODO-BACKEND
  userPayments: (id: string) => `super-admin/users/${id}/payments`, // TODO-BACKEND
  userBalances: (id: string) => `super-admin/users/${id}/balances`, // TODO-BACKEND
  adminBusinesses: (id: string) => `super-admin/admins/${id}/businesses`, // EXISTS
  userAnalytics: (id: string) => `super-admin/analytics/user/${id}`, // EXISTS
  createUser: 'super-admin/users', // EXISTS
  businesses: 'super-admin/businesses', // TODO-BACKEND (paginated form)
  business: (id: string) => `super-admin/businesses/${id}`, // TODO-BACKEND
  createBusiness: (id: string) => `super-admin/users/${id}/business`, // EXISTS
  businessStaff: (id: string) => `super-admin/businesses/${id}/staff`, // EXISTS
  deleteBusiness: (id: string) => `super-admin/businesses/${id}`, // EXISTS
  campaigns: 'super-admin/campaigns', // TODO-BACKEND
  campaign: (id: string) => `super-admin/campaigns/${id}`, // TODO-BACKEND
  campaignStatus: (id: string) => `super-admin/campaigns/${id}/status`, // TODO-BACKEND
  campaignAnalytics: (id: string) => `super-admin/analytics/campaign/${id}`, // EXISTS
  staff: (id: string) => `super-admin/staff/${id}`, // TODO-BACKEND
  customers: 'super-admin/customers', // TODO-BACKEND
  customer: (id: string) => `super-admin/customers/${id}`, // TODO-BACKEND
  pointsAdjustment: (id: string) => `super-admin/customers/${id}/points-adjustment`, // TODO-BACKEND
  transactions: 'super-admin/transactions', // TODO-BACKEND
  redemptions: 'super-admin/redemptions', // TODO-BACKEND
  revokeCode: (id: string) => `super-admin/codes/${id}`, // TODO-BACKEND
  payments: 'super-admin/payments', // TODO-BACKEND
  platformAnalytics: 'super-admin/analytics/platform', // EXISTS stub → TODO-BACKEND
  auditLogs: 'super-admin/audit-logs', // TODO-BACKEND
} as const;
