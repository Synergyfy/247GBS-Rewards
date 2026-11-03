import { appEnv } from '@/lib/env';
import type { SuperAdminApi } from './api';
import { realApi } from './client';
import { mockApi } from './mock/mock-api';

export type { SuperAdminApi } from './api';
export const superAdminApi: SuperAdminApi = appEnv.USE_MOCKS ? mockApi : realApi;
