import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Loader2, Sparkles, AlertCircle, Users, TrendingUp, Shield, ChevronRight, Briefcase } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
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
    <div className="min-h-screen w-full flex bg-white text-slate-900 overflow-hidden relative selection:bg-blue-500/10">
      {/* Login Form Side (Left) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-24 relative z-20 bg-white">
        <div className="w-full max-w-md space-y-8 relative">
          {/* Back Button */}
          <Link
            href="/"
            className="absolute -top-16 left-0 inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="space-y-4 text-center lg:text-left">
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
              className="text-4xl md:text-5xl font-black tracking-tight text-slate-900"
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-4 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
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

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-widest font-bold">Or continue with</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all group">
                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} className="w-5 h-5" />
                <span className="text-slate-700 font-bold text-sm">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all group">
                <Image src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" width={20} height={20} className="w-5 h-5" />
                <span className="text-slate-700 font-bold text-sm">Facebook</span>
              </button>
            </div>

            <p className="text-center text-slate-500 text-sm mt-8 font-medium">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-black hover:underline transition-all">
                Create one now
              </Link>
            </p>
          </motion.form>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 text-center w-full text-xs text-slate-400 font-bold uppercase tracking-widest">
          &copy; 2026 247GBS Inc. All rights reserved.
        </div>
      </div>

      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-slate-950">
        {/* Roles Slider (which handles its own backgrounds) */}
        <RolesSlider />
      </div>
    </div>
  );
};

const roles = [
  {
    id: 'manager',
    title: 'Account Manager',
    description: 'Expertly manage client accounts, track network-wide performance, and ensure premium service delivery.',
    icon: Briefcase,
    color: 'from-blue-500 to-indigo-600',
    image: '/images/account_manager_slide.png',
    metrics: ['Portfolio Management', 'Growth Tracking', 'Network Support']
  },
  {
    id: 'consultant',
    title: 'Business Consultant',
    description: 'Provide high-level strategic growth advice and unlock hidden profit potentials using our 80+ audit tools.',
    icon: TrendingUp,
    color: 'from-indigo-500 to-purple-600',
    image: '/images/consultant_slide.png',
    metrics: ['Strategic Insights', 'Profit Recovery', 'Scaling Experts']
  },
  {
    id: 'agent',
    title: 'Business Agent',
    description: 'Drive direct business engagement, manage local campaigns, and provide hands-on onboarding support.',
    icon: Shield,
    color: 'from-blue-600 to-cyan-600',
    image: '/images/agent_slide.png',
    metrics: ['Local Onboarding', 'Campaign Management', 'Field Sales']
  }
];

const RolesSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % roles.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={roles[currentSlide].image}
            alt={roles[currentSlide].title}
            layout="fill"
            objectFit="cover"
            priority
            className="scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Ambient Gradients linked to current slide color */}
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none z-10 bg-blue-600/20`}
      />

      <div className="relative z-20 h-full flex flex-col items-center justify-center p-20 text-center text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            {/* Icon Badge */}
            <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${roles[currentSlide].color} flex items-center justify-center shadow-2xl mb-12 rotate-3 transition-all duration-500 hover:rotate-0 hover:scale-110 border border-white/20`}>
              {React.createElement(roles[currentSlide].icon, { className: "w-12 h-12 text-white" })}
            </div>

            <h2 className="text-6xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              {roles[currentSlide].title}
            </h2>

            <p className="text-xl text-blue-100/90 font-medium max-w-lg mb-12 leading-relaxed h-[4.5rem]">
              {roles[currentSlide].description}
            </p>

            {/* Metric Tags */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {roles[currentSlide].metrics.map((metric, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-black backdrop-blur-xl shadow-xl"
                >
                  {metric}
                </motion.span>
              ))}
            </div>

            {/* CTA Button */}
            <button className="group relative px-12 py-6 bg-white text-slate-950 font-black text-2xl rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-3 overflow-hidden">
              <span className="relative z-10 transition-colors group-hover:text-blue-600">
                Continue as {roles[currentSlide].title}
              </span>
              <ChevronRight className="relative z-10 w-7 h-7 group-hover:translate-x-1 transition-all group-hover:text-blue-600" />
              <motion.div
                className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicators */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-4 z-30">
          {roles.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="group relative h-3 transition-all duration-500"
            >
              <div className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-16 bg-white' : 'w-4 bg-white/30 group-hover:bg-white/50'
                }`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
