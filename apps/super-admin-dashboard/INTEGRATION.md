# Integration guide

## Drop-in to the monorepo

1. Copy this entire app folder to `apps/super-admin-dashboard/`.
2. Delete any app-local lockfile and `node_modules` directory.
3. Run `pnpm install` at the monorepo root.
4. Run `pnpm --filter super-admin-dashboard dev` (Vite uses port `8079`).

The root `pnpm dev` Turbo task can then run the dashboard alongside the API and business app. The dashboard is intentionally self-contained; nothing outside this folder is required by its imports or configuration.

## Environment

For local development, use the following in `.env.local`:

```dotenv
VITE_API_BASE_URL=http://localhost:7001/
VITE_WEB_APP_URL=http://localhost:8078
VITE_USE_MOCKS=false
```

Mocks are opt-in: only `VITE_USE_MOCKS=true` enables them, and any other build talks to the real API and leaves the mock API and fixtures out of the bundle. For standalone mock development, use `VITE_USE_MOCKS=true`. The mock credential is `super@247gbs.test` / `password`; `admin@247gbs.test` / `password` is rejected. `VITE_MOCK_ERROR=403` or `500` can force the matching mock error state. `VITE_*` variables are compiled into the browser bundle: set production values at the hosting provider before building and do not place secrets in them.

## Backend prerequisites

The API already allows the dashboard origins (`http://localhost:8079`, `http://127.0.0.1:8079`) through Nest CORS in `apps/api/src/main.ts`; add the production dashboard URL there when it is known. At least one `Users` row must have role `super_admin`: run `pnpm --filter mcom_backend seed:super-admin` (reads `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `SUPER_ADMIN_NAME` and `SUPER_ADMIN_PHONE` from `apps/api/.env`). Run `pnpm --filter mcom_backend migration:run` first so the `SuperAdminDashboard` migration (audit log table, `isActive` flags) is applied.

## Endpoint map

All paths are in `src/services/endpoints.ts` and every one is implemented by `apps/api/src/modules/super-admin`. List endpoints paginate, search, filter and sort server-side and answer `Paginated<T>` (`page` default 1, `limit` default 25 / max 100, `order` default `DESC`). Mutations are written to the super-admin audit log with the optional or required `reason`.

| Method | Path | Used by |
|---|---|---|
| POST | `auth/` | Login |
| GET | `super-admin/admins` | Admins list, ⌘K search, business owner picker |
| GET | `super-admin/users` | (available; filters `role`, `signupSource`, `isActive`, `createdFrom`, `createdTo`) |
| GET | `super-admin/users/:id` | Admin detail |
| PATCH | `super-admin/users/:id` | Admin detail → Edit |
| PATCH | `super-admin/users/:id/status` | Activate / deactivate (detail and bulk) |
| POST | `super-admin/users/:id/reset-password` | Reset password (returns a one-time temporary password) |
| DELETE | `super-admin/users/:id` | Delete admin (also deletes the businesses they own) |
| GET | `super-admin/admins/:id/businesses` | (available) |
| POST | `super-admin/users/:userId/business` | Create business |
| GET | `super-admin/businesses` | Businesses list, ⌘K search (`userId` filter) |
| GET | `super-admin/businesses/:id` | Business detail |
| PATCH | `super-admin/businesses/:id` | Business detail → Edit (address is sent whole) |
| DELETE | `super-admin/businesses/:id` | Delete business (cascades) |
| GET | `super-admin/businesses/:id/staff` | (available; detail page uses `staffs` from the business) |
| PATCH | `super-admin/staff/:id` | Staff row actions: edit, activate / deactivate |
| GET | `super-admin/campaigns` | Campaigns list, admin Campaigns tab (`userId`), ⌘K search; filters `businessId`, `userId`, `type`, `active` |
| GET | `super-admin/campaigns/:id` | Campaign detail |
| PATCH | `super-admin/campaigns/:id/status` | Campaign activate / deactivate |
| GET | `super-admin/campaigns/:id/codes` | Campaign → Codes tab; `kind` = `point_code` (default), `reward_code`, `reward_number`, `customer_number` |
| DELETE | `super-admin/codes/:id` | Codes tab → Revoke (body `{ reason }`, recorded in the audit log) |
| GET | `super-admin/analytics/platform` | Overview (`from`/`to`, cached 60s) |
| GET | `super-admin/analytics/user/:id` | Admin detail KPIs |
| GET | `super-admin/analytics/business/:id` | Business detail KPIs |
| GET | `super-admin/analytics/campaign/:id` | Campaign detail KPIs and activity charts |
| GET | `super-admin/customers` | Customers list: one row per person grouped by `lower(email)`; `campaignId` / `businessId` scope the memberships |
| GET | `super-admin/customers/:id` | Customer detail; `:id` is any membership id |
| POST | `super-admin/customers/:id/points-adjustment` | Adjust points; `:id` is the membership for the chosen campaign |
| GET | `super-admin/redemptions` | Campaign → Redemptions tab |
| GET | `super-admin/audit-logs` | Audit log, admin Activity tab, overview feed |

"Create admin" (`POST super-admin/users`) exists in the API but was intentionally removed from the dashboard.

## Domain rules to preserve

Use `created_at` and `updated_at` snake_case timestamp keys. An audit entry's `actor` is `null` once the acting account has been deleted. IDs are UUID strings; dates are ISO strings. Never return a password in API response types. A campaign is active if it is non-`SEASONAL`, or if its related season exists and the current date lies within its start/end dates; a seasonal campaign without a season is inactive.

The API hardening items from the backend notes remain important: ensure public signup cannot set role, password hashes are not exposed, routes are scoped, unknown records return 404, login enforces `isActive`, mutation writes are audited, analytics aggregates are implemented, duplicate email/phone checks exist, and a super-admin seed/promotion path is available. CORS changes also belong in the API, not this dashboard.
