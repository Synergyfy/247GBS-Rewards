import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { setSession } from '@/lib/session';
import { appEnv } from '@/lib/env';
import { superAdminApi } from '@/services';
import type { Role } from '@/services/types';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setError(cause instanceof Error ? cause.message : 'Unable to sign in. Try again.');
    } finally { setPending(false); }
  }
  return <main className="login-page"><section className="login-card"><div className="brand"><span className="brand-mark">247</span><span>247GBS Rewards<span className="brand-sub">SUPER ADMIN</span></span></div><h1>Sign in</h1><p>Use your super-admin account to continue.</p><form onSubmit={submit}>
    <div className="form-field"><label htmlFor="email">Email</label><input id="email" className="input" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
    <div className="form-field"><label htmlFor="password">Password</label><input id="password" className="input" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button primary login-submit" type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
  </form>{appEnv.USE_MOCKS && <p style={{ marginTop: 13, marginBottom: 0 }}>Mock mode: <span className="tabular">super@247gbs.test / password</span></p>}</section></main>;
}
