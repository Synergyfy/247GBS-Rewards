import type { ApiError } from '@/services/types';

export function normalizeApiError(value: unknown): ApiError {
  if (value && typeof value === 'object' && 'response' in value) {
    const response = (value as { response?: { status?: number; data?: unknown } }).response;
    const data = response?.data;
    if (data && typeof data === 'object') {
      const body = data as { status?: number; statusCode?: number; error?: string; message?: string | string[] };
      const message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
      return { status: body.statusCode ?? body.status ?? response?.status ?? 500, message: message ?? body.error ?? 'Request failed.' };
    }
    return { status: response?.status ?? 500, message: 'Request failed.' };
  }
  if (value instanceof Error) return { status: 0, message: value.message };
  return { status: 500, message: 'An unexpected error occurred.' };
}
