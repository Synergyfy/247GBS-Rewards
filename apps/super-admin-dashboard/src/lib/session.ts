import type { Role } from '@/services/types';

export interface SessionUser { name: string; email: string; role: Role; }
const TOKEN_COOKIE = 'sa_token';
const USER_COOKIE = 'sa_user';

function readCookie(name: string): string | null {
  const item = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
}
function writeCookie(name: string, value: string, maxAge: number): void {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  // Lax per §4.2: the token is only ever read by this app's own JS, never sent cross-site
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}
export function getToken(): string | null { return readCookie(TOKEN_COOKIE); }
export function getSessionUser(): SessionUser | null {
  try {
    const value = readCookie(USER_COOKIE);
    return value ? JSON.parse(value) as SessionUser : null;
  } catch { return null; }
}
export function setSession(token: string, user: SessionUser): void {
  writeCookie(TOKEN_COOKIE, token, 86400);
  writeCookie(USER_COOKIE, JSON.stringify(user), 86400);
}
export function clearSession(): void {
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${USER_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
function decodePayload(token: string): { exp?: number; role?: Role } | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
    return JSON.parse(atob(padded)) as { exp?: number; role?: Role };
  } catch { return null; }
}
export function hasValidSuperAdminSession(): boolean {
  const token = getToken();
  if (!token) return false;
  const payload = decodePayload(token);
  return Boolean(payload && payload.role === 'super_admin' && typeof payload.exp === 'number' && payload.exp * 1000 > Date.now());
}
export function createMockToken(role: Role, email = 'super@247gbs.test'): string {
  const encode = (value: object) => btoa(JSON.stringify(value)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: `mock-${role}`, email, role, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 })}.mock-signature`;
}
