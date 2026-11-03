import axios from 'axios';
import { appEnv } from '@/lib/env';
import { clearSession, getToken } from '@/lib/session';
import { normalizeApiError } from '@/lib/errors';

export const http = axios.create({ baseURL: appEnv.API_BASE_URL.endsWith('/') ? appEnv.API_BASE_URL : `${appEnv.API_BASE_URL}/`, headers: { 'Content-Type': 'application/json' } });
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
http.interceptors.response.use((response) => response, (error: unknown) => {
  const normalized = normalizeApiError(error);
  if (normalized.status === 401) {
    clearSession();
    if (window.location.pathname !== '/login') window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
  }
  return Promise.reject(Object.assign(new Error(normalized.message), normalized));
});
