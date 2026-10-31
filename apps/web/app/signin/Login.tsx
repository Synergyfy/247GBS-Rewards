'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const ERROR_MESSAGES: Record<string, string> = {
  central_denied:
    'Central Hub denied access for this account. Please contact MCOM if you believe this is a mistake.',
  missing_code:
    'Central Hub did not return an authorization code. Please try signing in again.',
  invalid_state:
    'Your sign-in attempt expired or could not be verified. Please try again.',
  business_only:
    'Central Hub sign-in is available to business accounts only.',
  not_granted:
    'This business has not been granted access to 247GBS Rewards yet. Please contact MCOM to request access.',
  exchange_failed:
    'We could not complete the Central Hub sign-in. Please try again.',
  session_failed:
    'Central Hub verified your account, but we could not start your session. Please try again.',
};

const Login = () => {
  const searchParams = useSearchParams();
  const ssoError = searchParams.get('sso_error');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const errorMessage = ssoError
    ? ERROR_MESSAGES[ssoError] ||
      'We could not sign you in with Central Hub. Please try again.'
    : null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-900 overflow-hidden relative selection:bg-blue-500/10 p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-100/40 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[480px] relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12 relative overflow-hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold group mb-10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="w-full space-y-8 relative">
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
                className="text-slate-500 text-sm leading-relaxed"
              >
                Sign in with your MCOM Central Hub business account to manage
                your rewards programme.
              </motion.p>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <a
                href="/api/auth/sso/start"
                onClick={() => setIsRedirecting(true)}
                aria-disabled={isRedirecting}
                className={`w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-white font-bold shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 ${
                  isRedirecting ? 'pointer-events-none opacity-80' : ''
                }`}
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting to Central Hub...
                  </>
                ) : (
                  <>
                    <Building2 className="w-5 h-5" />
                    Login with MCOM Central Hub
                  </>
                )}
              </a>

              <div className="flex items-center gap-2 justify-center text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  Authentication and access are managed by MCOM Central Hub.
                </span>
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-slate-400 space-y-2">
              <p>
                Staff and customer sign-in is still available from the campaign
                and staff portals.
              </p>
              <p>
                Need help?{' '}
                <Link
                  href="/support"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Contact support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
