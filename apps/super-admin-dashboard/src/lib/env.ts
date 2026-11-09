const env = import.meta.env;

export const appEnv = {
  API_BASE_URL: env.VITE_API_BASE_URL || 'http://localhost:7001/',
  WEB_APP_URL: env.VITE_WEB_APP_URL || 'http://localhost:8078',
  /** Opt-in: a build without VITE_USE_MOCKS=true always talks to the real API. */
  USE_MOCKS: env.VITE_USE_MOCKS === 'true',
  MOCK_ERROR: env.VITE_MOCK_ERROR || '',
} as const;
