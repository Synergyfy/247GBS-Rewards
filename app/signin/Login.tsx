import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Loader2, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { errorType, useAuth } from '@/services/hooks/auth/hook';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const {
    data,
    isSuccess,
    isPending,
    isError,
    error: respError,
    mutate,
  } = useAuth();

  useEffect(() => {
    if (isError) {
      const error = respError as unknown as errorType;
      // Safety check for error response structure
      const errorMsg = error?.response?.data?.error || 'Authentication failed. Please try again.';
      setError(errorMsg);
    } else if (isSuccess) {
      if (data?.accessToken) {
        document.cookie = `token=${data.accessToken}; max-age=86400; path=/; secure;`;
        localStorage.setItem('username', data.name || 'User');
        router.push('/loyalty-admin');
      }
    }
  }, [respError, isError, isSuccess, data, router]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    mutate({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-900 overflow-hidden relative selection:bg-blue-500/10 p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-100/40 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[480px] relative z-20">
        {/* Login Form Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12 relative overflow-hidden">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold group mb-10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="w-full space-y-8 relative">
            {/* Header */}
            <div className="space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider"
              >
                <Sparkles className="w-3 h-3" />
                SECURE ACCESS
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-4xl font-black tracking-tight text-slate-900"
              >
                Welcome <span className="text-blue-600">Back</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-slate-600 text-lg font-medium"
              >
                Log in to your 247GBS dashboard.
              </motion.p>
            </div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-4 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>

                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-4 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500/20 transition-all" />
                  <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </motion.form>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center w-full text-xs text-slate-400 font-bold uppercase tracking-widest">
          &copy; 2026 247GBS Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
