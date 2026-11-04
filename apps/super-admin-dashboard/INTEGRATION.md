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

For standalone mock development, use `VITE_USE_MOCKS=true`. The mock credential is `super@247gbs.test` / `password`; `admin@247gbs.test` / `password` is rejected. `VITE_MOCK_ERROR=403` or `500` can force the matching mock error state. `VITE_*` variables are compiled into the browser bundle: set production values at the hosting provider before building and do not place secrets in them.

## Backend prerequisites and follow-ups

The API must allow the dashboard origin through Nest CORS. Add `http://localhost:8079`, `http://127.0.0.1:8079`, and the production dashboard URL to the origin allow-list in `apps/api/src/main.ts` (or the current API `main.ts`). At least one `Users` row must have role `super_admin`. Merge backend hardening branch `fix/super-admin-api-hardening` before connecting the dashboard to a real API.

## Endpoint map

All paths are in `src/services/endpoints.ts`. `EXISTS` endpoints are currently available in the API per the supplied contract; `TODO-BACKEND` endpoints need the indicated backend work before real mode can use those sections.

| Method | Path | Status / note |
|---|---|---|
| POST | `auth/` | EXISTS |
| GET | `super-admin/admins` | EXISTS; array is adapted for local filtering/pagination |
| GET | `super-admin/users` | EXISTS array; paginated form and filters are TODO-BACKEND |
| GET | `super-admin/users/:id` | TODO-BACKEND |
| PATCH | `super-admin/users/:id` | TODO-BACKEND |
| PATCH | `super-admin/users/:id/status` | TODO-BACKEND |
| POST | `super-admin/users/:id/reset-password` | TODO-BACKEND |
| DELETE | `super-admin/users/:id` | TODO-BACKEND |
| GET | `super-admin/admins/:id/businesses` | EXISTS |
| GET | `super-admin/analytics/user/:id` | EXISTS |
| GET | `super-admin/businesses` | Paginated list/filter contract is TODO-BACKEND |
| GET | `super-admin/businesses/:id` | TODO-BACKEND |
| POST | `super-admin/users/:userId/business` | EXISTS |
| PATCH | `super-admin/businesses/:id` | TODO-BACKEND |
| DELETE | `super-admin/businesses/:id` | EXISTS; cascades to campaigns, staff, segments, seasons and links |
| GET | `super-admin/businesses/:id/staff` | EXISTS |
| PATCH | `super-admin/staff/:id` | TODO-BACKEND |
| GET | `super-admin/campaigns` | TODO-BACKEND |
| GET | `super-admin/campaigns/:id` | TODO-BACKEND |
| PATCH | `super-admin/campaigns/:id/status` | TODO-BACKEND |
| GET | `super-admin/analytics/campaign/:id` | EXISTS |
| GET | `super-admin/customers` | TODO-BACKEND |
| GET | `super-admin/customers/:id` | TODO-BACKEND |
| POST | `super-admin/customers/:id/points-adjustment` | TODO-BACKEND |
| GET | `super-admin/redemptions` | TODO-BACKEND |
| DELETE | `super-admin/codes/:id` | TODO-BACKEND |
| GET | `super-admin/analytics/platform` | Existing API is a stub; usable aggregate response is TODO-BACKEND |
| GET | `super-admin/audit-logs` | TODO-BACKEND |

## Array adapters to remove when the backend paginates

`src/services/client.ts` marks the client-side `adaptedList` helper with `// ADAPTER: remove when backend paginates`. It supports legacy array responses by applying search, sort, and page/limit locally. Remove it once list endpoints return `Paginated<T>` and preserve the public `SuperAdminApi` shape.

## Domain rules to preserve

Use `created_at` and `updated_at` snake_case timestamp keys. IDs are UUID strings; dates are ISO strings. Never return a password in API response types. A campaign is active if it is non-`SEASONAL`, or if its related season exists and the current date lies within its start/end dates; a seasonal campaign without a season is inactive.

The API hardening items from the backend notes remain important: ensure public signup cannot set role, password hashes are not exposed, routes are scoped, unknown records return 404, login enforces `isActive`, mutation writes are audited, analytics aggregates are implemented, duplicate email/phone checks exist, and a super-admin seed/promotion path is available. CORS changes also belong in the API, not this dashboard.
