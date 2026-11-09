import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { setSession } from '@/lib/session';
import { appEnv } from '@/lib/env';
import { superAdminApi } from '@/services';
import type { Role } from '@/services/types';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setPending(true);
    try {
      const response = await superAdminApi.login(email.trim(), password);
      if (response.role !== 'super_admin') { setError('This account does not have super-admin access'); return; }
      setSession(response.accessToken, { name: response.name, email: email.trim(), role: response.role as Role });
      toast.success('Signed in successfully');
      const next = params.get('next');
      navigate(next?.startsWith('/') && !next.startsWith('//') ? next : '/', { replace: true });
    } catch (cause) {
      // The API answers 400 (wrong password) or 404 (unknown email); don't reveal which accounts exist
      const status = (cause as { status?: number } | null)?.status;
      if (status === 400 || status === 401 || status === 404) setError('Invalid email or password.');
      // 403: correct credentials on a deactivated account; the API message says so
      else if (status === 403 && cause instanceof Error) setError(cause.message);
      else setError('Unable to sign in. Try again.');
    } finally { setPending(false); }
  }
  return <main className="login-page"><section className="login-card"><div className="brand"><span className="brand-mark">247</span><span>247GBS Rewards<span className="brand-sub">SUPER ADMIN</span></span></div><h1>Sign in</h1><p>Use your super-admin account to continue.</p><form onSubmit={submit}>
    <div className="form-field"><label htmlFor="email">Email</label><Input id="email"  type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
    <div className="form-field"><label htmlFor="password">Password</label><div className="relative"><Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="pr-9" /><button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} aria-controls="password" className="absolute inset-y-0 right-0 flex w-8 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <Button variant="default" className="login-submit" type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</Button>
  </form>{appEnv.USE_MOCKS && <p style={{ marginTop: 13, marginBottom: 0 }}>Mock mode: <span className="tabular-nums">super@247gbs.test / password</span></p>}</section></main>;
}
