import type { CustomerMembership } from '@/services/types';

/** Plain-text list of a customer's campaigns, for CSV export. */
export const membershipsCsv = (memberships: CustomerMembership[]) =>
  memberships.map((membership) => membership.campaign?.name ?? 'Removed campaign').join('; ');
