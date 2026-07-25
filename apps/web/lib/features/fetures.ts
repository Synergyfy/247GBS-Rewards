import { featutresAccess } from '@/app/interfaces/featutresAccess.type';
import { FeatureCategory, PaidVersion } from '@/app/interfaces/versions.enum';

export const mcomBotsFeatures: featutresAccess[] = [
  {
    feature: 'Mcom Bots',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.MCOM_BOTS,
  },
  {
    feature: 'Home',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.MCOM_BOTS,
  },
  {
    feature: 'Dashboard',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.MCOM_BOTS,
  },
  {
    feature: 'Qr Code',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.MCOM_BOTS,
  },
  {
    feature: 'Scanner',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.MCOM_BOTS,
  },
  {
    feature: 'Customer Tab',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.MCOM_BOTS,
  },
];

export const analyticsFeatures: featutresAccess[] = [
  {
    feature: 'Earnings',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.ANALYTICS,
  },
  {
    feature: 'Spending',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.ANALYTICS,
  },
  {
    feature: 'QR Code Scan History',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.ANALYTICS,
  },
];

export const profileManagementFeatures: featutresAccess[] = [
  {
    feature: 'Your Profile',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.PROFILE_MANAGEMENT,
  },
  {
    feature: 'Merchants',
    access: [PaidVersion.PROPLUS],
    category: FeatureCategory.PROFILE_MANAGEMENT,
  },
  {
    feature: 'Business',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.PROFILE_MANAGEMENT,
  },
  {
    feature: 'Staff',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.PROFILE_MANAGEMENT,
  },
  {
    feature: 'National Membership',
    access: [PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.PROFILE_MANAGEMENT,
  },
  {
    feature: 'Consumers',
    access: [PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.PROFILE_MANAGEMENT,
  },
  {
    feature: 'Account Managers',
    access: [PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.PROFILE_MANAGEMENT,
  },
  {
    feature: 'Agents',
    access: [PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.PROFILE_MANAGEMENT,
  },
  {
    feature: 'Consultants',
    access: [PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.PROFILE_MANAGEMENT,
  },
  {
    feature: 'Segments',
    access: [PaidVersion.PRO, PaidVersion.PROPLUS],
    category: FeatureCategory.PROFILE_MANAGEMENT,
  },
];

export const mcomBotsPrograms: featutresAccess[] = [
  {
    feature: 'Mcom Perks',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
  },
  {
    feature: 'Mcom Cards',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
  },
  {
    feature: 'NFC Cardtap',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
  },
  {
    feature: 'NFC Tags',
    access: [PaidVersion.PROPLUS],
  },
  {
    feature: 'Mcom E-Stores',
    access: [PaidVersion.PRO, PaidVersion.PROPLUS],
  },
  {
    feature: 'Nearby',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
  },
  {
    feature: 'Rewards',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
  },
  {
    feature: 'Loyalty',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
  },
  {
    feature: 'Mcom AI Bots',
    access: [PaidVersion.PROPLUS],
  },
  {
    feature: 'Seasonal Marketing Periods X4',
    access: [PaidVersion.PROPLUS],
  },
  {
    feature: 'Excess Stock Audit',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
  },
  {
    feature: 'Spare Capacity Audit',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
  },
  {
    feature: 'Mcom Newsletter',
    access: [PaidVersion.PROPLUS],
  },
  {
    feature: 'White Label Consortium',
    access: [],
  },
];

export const mcomAccessAndSettings: featutresAccess[] = [
  {
    feature: 'Mcom Points',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
  },
  {
    feature: 'Mcom Credits',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
  },
  {
    feature: 'Mcom Stamps',
    access: [PaidVersion.FREE, PaidVersion.PRO, PaidVersion.PROPLUS],
  },
  {
    feature: 'Mcom Tokens',
    access: [PaidVersion.PROPLUS],
  },
  {
    feature: 'Mcom Whitelabel Partner',
    access: [PaidVersion.PRO, PaidVersion.PROPLUS],
  },
  {
    feature: 'Mcom Exchange and Redeem',
    access: [PaidVersion.PRO, PaidVersion.PROPLUS],
  },
];

interface ComparisonTablesType {
  [key: string]: featutresAccess[];
}

export const ComparisonTableItems: ComparisonTablesType = {
  'Mcom Bots Features': mcomBotsFeatures,
  Analytics: analyticsFeatures,
  'Profile Management': profileManagementFeatures,
  'Mcom Bots': mcomBotsPrograms,
  'Mcom Access and Settings': mcomAccessAndSettings,
};
