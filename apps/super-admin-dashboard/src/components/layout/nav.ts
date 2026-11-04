import {
  Activity,
  Building2,
  LayoutDashboard,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

// §9B sidebar groups; also the page list the command palette searches
export const navGroups: NavGroup[] = [
  {
    label: 'Monitor',
    items: [
      { label: 'Overview', path: '/', icon: LayoutDashboard },
      { label: 'Audit log', path: '/audit-log', icon: Activity },
    ],
  },
  {
    label: 'Accounts',
    items: [
      { label: 'Admins', path: '/admins', icon: ShieldCheck },
      { label: 'Businesses', path: '/businesses', icon: Building2 },
    ],
  },
  {
    label: 'Programs',
    items: [
      { label: 'Campaigns', path: '/campaigns', icon: Activity },
      { label: 'Customers', path: '/customers', icon: Users },
    ],
  },
];

export const navItems: NavItem[] = navGroups.flatMap((group) => group.items);

// Breadcrumb labels for top-level path segments
export const pageLabels: Record<string, string> = {
  admins: 'Admins',
  businesses: 'Businesses',
  campaigns: 'Campaigns',
  customers: 'Customers',
  'audit-log': 'Audit log',
};
