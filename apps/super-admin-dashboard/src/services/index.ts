import type { SuperAdminApi } from './api';
import { realApi } from './client';
import { mockApi } from './mock/mock-api';

export type { SuperAdminApi } from './api';
// Compared inline (not via appEnv) so Vite folds the condition and leaves the mock fixtures out of real builds
export const superAdminApi: SuperAdminApi = import.meta.env.VITE_USE_MOCKS === 'true' ? mockApi : realApi;
