# Implementation plan — 247GBS Rewards Super Admin

## Scope and architecture

Build the standalone React 19 + Vite + TypeScript SPA in this project root, with no imports from outside the folder. Keep all API paths in `src/services/endpoints.ts`; define backend-shaped models in `src/services/types.ts`, transport and error handling in `http.ts`/`client.ts`, and a parallel realistic in-memory adapter in `services/mock/`. Select the implementation with `VITE_USE_MOCKS`; route components and hooks call only the `SuperAdminApi` service interface. Use TanStack Query for server state, React state for transient UI and URL query parameters for list state. Protect the application shell with JWT/session guards and role validation; retain `/login` as a public entry.

Use React Router v7 lazy route modules, reusable accessible compact UI primitives, and the requested pages for overview, admins, businesses, campaigns, customers, transactions, payments and audit events. Make the overview and high-traffic list/detail flows functional against mock fixtures, with explicit `NotAvailableYet` feedback for unimplemented backend contracts in real mode. Provide complete independent package/config files and the two handoff documents (`README.md`, `INTEGRATION.md`). The app must remain installable and runnable on port 8079 after it is copied to `apps/super-admin-dashboard/`.

## Project structure

- `src/routes/`: lazy-loaded pages and the authenticated shell.
- `src/components/`: reusable shell, table/filter, badges, KPIs, dialogs and detail components.
- `src/services/`: typed API contract, endpoint map, Axios client, query hooks and realistic mock implementation.
- `src/hooks/`: URL list state, session and keyboard interactions.
- `src/lib/`: environment, cookie/JWT/session, formatting, error, status and theme utilities.
- Root config/docs: Vite, TypeScript, ESLint, Tailwind v4, shadcn aliases, env template, static-host fallback and operator handoff.

## Design direction

### Design Movement
Flat Data-Dense Design: an enterprise SaaS operations console with precise grid alignment and high information density.

### Core Principles
1. Prioritize scanability and meaningful decision information over decorative space.
2. Use a restrained brand-blue accent against crisp neutral surfaces and fine dividers.
3. Keep controls compact, sharp, consistent and accessible by keyboard.
4. Reserve motion for response, orientation and visible state changes; respect reduced motion.

### Color Philosophy
Use the supplied business-app palette: #2D3DFF as the ownable action/navigation color, #DDE2FA as its selection tint, gray-50/white/gray-200 neutral surfaces, green for success and restrained amber/red for warning and danger. Keep color supplementary to text labels and icons, with a matching dark palette.

### Layout Paradigm
A persistent 224px navigation rail and 44px top bar frame dense, left-aligned content panels. Use short page gutters, compact KPI strips, sticky table headers, and two-column detail layouts that collapse in order on small screens.

### Signature Elements
- A compact blue geometric 247 mark in the sidebar and browser favicon.
- Thin high-contrast table rules with lively text-bearing status pills.
- KPI strip cells separated by single-pixel borders, emphasizing operational metrics.

### Interaction Philosophy
Keep actions next to the affected records. Synchronize list filters to the URL, keep important flows keyboard-operable, and reserve confirmation for irreversible/high-impact actions. Reversible status switches should be immediate and undoable.

### Animation
Use only the prompt's named CSS timing tokens and transitions on transform, opacity and state colors. Disable chart entrance animation, respect `prefers-reduced-motion`, and avoid decorative movement, bouncing, gradients, large shadows and layout-shifting transitions.

### Typography System
Inter Variable throughout; 13px/20px base text, 11–12px muted metadata/table headings, 18px page titles, 14px section titles, and 20px semibold tabular KPI values. Numeric cells use tabular figures.

### Brand Essence
A precise control room for the people responsible for trust and health of the 247GBS Rewards platform. Personality: calm, exact, responsive.

### Brand Voice
Use direct, specific, operational language. Examples: “Platform activity” and “Changes are recorded in the audit trail.”

### Wordmark & Logo
A compact square blue tile with a crisp white “247”/check-like glyph, paired with the 247GBS Rewards name in the application shell; use a matching simple SVG favicon.

### Signature Brand Color
247GBS electric blue #2D3DFF.

## Material constraints

This is a frontend connected to an existing REST API, not a new backend. Mocks are the default and require no external service. In real mode the API URL, web-app URL and mock toggle are build-time `VITE_*` settings. Existing endpoint response arrays need explicit client-side adapter functions; future paginated calls are TODO-BACKEND and must not crash the UI. Do not add a database, lockfile, unrelated state manager, table library, CSS-in-JS, or animation dependency. Ensure standalone root scripts include `dev`, `build`, `lint`, and `typecheck`.
