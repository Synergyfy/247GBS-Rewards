import { createBrowserRouter, redirect } from 'react-router';
import { hasValidSuperAdminSession } from '@/lib/session';
import { RootLayout } from '@/components/layout/RootLayout';
import { RouteError } from '@/routes/route-error';

function requireSuperAdmin({ request }: { request: Request }) {
  if (!hasValidSuperAdminSession()) {
    const url = new URL(request.url);
    throw redirect(`/login?next=${encodeURIComponent(url.pathname + url.search)}`);
  }
  return null;
}
function publicLogin() { if (hasValidSuperAdminSession()) throw redirect('/'); return null; }
export const router = createBrowserRouter([
  { path: '/login', loader: publicLogin, lazy: async () => ({ Component: (await import('@/routes/login')).LoginPage }), errorElement: <RouteError /> },
  {
    path: '/', loader: requireSuperAdmin, Component: RootLayout, errorElement: <RouteError />,
    children: [
      { index: true, lazy: async () => ({ Component: (await import('@/routes/overview')).Overview }) },
      { path: 'admins', lazy: async () => ({ Component: (await import('@/routes/admins/list')).AdminsList }) },
      { path: 'businesses', lazy: async () => ({ Component: (await import('@/routes/businesses/list')).BusinessesList }) },
      { path: 'campaigns', lazy: async () => ({ Component: (await import('@/routes/campaigns/list')).CampaignsList }) },
      { path: 'customers', lazy: async () => ({ Component: (await import('@/routes/customers/list')).CustomersList }) },
      { path: 'audit-log', lazy: async () => ({ Component: (await import('@/routes/audit-log')).AuditLogList }) },
      { path: 'admins/:id', lazy: async () => ({ Component: (await import('@/routes/admins/detail')).AdminDetail }) },
      { path: 'businesses/:id', lazy: async () => ({ Component: (await import('@/routes/businesses/detail')).BusinessDetail }) },
      { path: 'campaigns/:id', lazy: async () => ({ Component: (await import('@/routes/campaigns/detail')).CampaignDetail }) },
      { path: 'customers/:id', lazy: async () => ({ Component: (await import('@/routes/customers/detail')).CustomerDetail }) },
      { path: '*', lazy: async () => ({ Component: (await import('@/routes/not-found')).NotFound }) },
    ],
  },
]);
