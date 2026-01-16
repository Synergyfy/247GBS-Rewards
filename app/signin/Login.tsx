import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { errorType, useAuth } from '@/services/hooks/auth/hook';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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
    <div className="min-h-screen w-full flex bg-slate-950 text-white overflow-hidden relative selection:bg-orange-500/30">
      {/* Visual Side (Left) */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black z-0">
          <Image
            src="/images/cyberpunk_signin_panel.png"
            alt="Cyberpunk Dashboard"
            layout="fill"
            objectFit="cover"
            priority
            className="opacity-90 scale-105 hover:scale-100 transition-transform duration-[20s] ease-linear"
          />
        </div>

        {/* Overlay Gradient for Text readability if needed, currently staying pure visual as requested */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 z-10" />

        {/* Floating Abstract Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none z-10" />
      </div>

      {/* Login Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-24 relative z-20">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative">
          {/* Back Button */}
          <Link
            href="/"
            className="absolute -top-24 left-0 inline-flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-xs font-bold text-orange-500 mb-2"
            >
              <Sparkles className="w-3 h-3" />
              SECURE ACCESS
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-5xl font-black tracking-tight text-white"
            >
              Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Back</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-slate-400 text-lg"
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
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
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
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300 backdrop-blur-sm"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
              </div>

              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300 backdrop-blur-sm"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-orange-600 focus:ring-orange-500/50 transition-all" />
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink-0 mx-4 text-slate-600 text-xs uppercase tracking-wider font-semibold">Or continue with</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Social Logins - Visual Only as per previous implementation logic */}
            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all group">
                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="text-slate-300 font-medium text-sm group-hover:text-white">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all group">
                <Image src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" width={20} height={20} className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="text-slate-300 font-medium text-sm group-hover:text-white">Facebook</span>
              </button>
            </div>

            <p className="text-center text-slate-500 text-sm mt-8">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-orange-500 hover:text-orange-400 font-bold hover:underline transition-all">
                Create one now
              </Link>
            </p>
          </motion.form>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 text-center w-full text-xs text-slate-700">
          &copy; 2026 247GBS Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
