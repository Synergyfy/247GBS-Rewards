# 247GBS Rewards Super Admin Dashboard

Standalone React/Vite super-admin console intended to live at `apps/super-admin-dashboard/` in the 247GBS Rewards monorepo. The dashboard talks only to the existing REST API; it also includes an in-memory mock service for local evaluation.

## Start with mocks

```sh
cp .env.example .env.local
pnpm install
pnpm dev
```

Open `http://localhost:8079`. Default mock login: **super@247gbs.test** / **password**. `admin@247gbs.test` / `password` is intentionally rejected to demonstrate role gating. Mock writes affect the in-memory session only and reset on reload. To force a mock error state, set `VITE_MOCK_ERROR=403` or `500` before starting the dev server.

## Connect to the REST API

Set `VITE_USE_MOCKS=false`, `VITE_API_BASE_URL` to the API origin with a trailing slash (for example `http://localhost:7001/`), and `VITE_WEB_APP_URL` to the business app origin (for example `http://localhost:8078`). All `VITE_*` values are bundled at build time; configure production values with the hosting provider before running `pnpm build`. Endpoint paths and their EXISTS/TODO-BACKEND labels are centralized in `src/services/endpoints.ts`; request/response adaptation is in `src/services/client.ts`.

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Vite development server on strict port 8079 |
| `pnpm build` | TypeScript project build and production Vite bundle |
| `pnpm preview` | Serve the production bundle on port 8079 |
| `pnpm lint` | Flat ESLint config, zero warnings allowed |
| `pnpm typecheck` | Strict TypeScript check |

`vercel.json` and `public/_redirects` provide SPA fallbacks for static hosting. The project has no lockfile by design; in the monorepo the root `pnpm-lock.yaml` is authoritative. See [INTEGRATION.md](./INTEGRATION.md) for the copy/paste handoff and API prerequisites.
