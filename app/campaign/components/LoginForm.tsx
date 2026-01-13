'use client';

import { errorType, useAuthCustomer } from '@/services/hooks/auth/hook';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoEye, IoEyeOff, IoMailOutline, IoLockClosedOutline } from 'react-icons/io5';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [campaignId, setCampaignId] = useState<string>('');
  const [campaignCode, setCampaignCode] = useState<string>('');
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

  useEffect(() => {
    const campaign = localStorage.getItem('currentCampaign');
    setCampaignCode(campaign ?? '');
    const campaignId = localStorage.getItem('campaignId');
    setCampaignId(campaignId ?? '');
  }, []);

  const {
    data,
    isSuccess,
    isPending,
    isError,
    error: respError,
    mutate,
  } = useAuthCustomer();

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Enter email and password');
      return;
    }

    mutate({ email, password, campaignId });
  };

  useEffect(() => {
    if (isError) {
      const error = respError as unknown as errorType;
      const errorMsg = error.response.data.error;
      setError(errorMsg);
    } else if (isSuccess) {
      const currentCampaign = localStorage.getItem('currentCampaign');
      console.log('current', currentCampaign);
      document.cookie = `customerToken=${data.accessToken}; max-age=86400; path=/; secure;`;
      document.cookie = `tokenOwner=${campaignCode}; max-age=86400; path=/; secure;`;

      router.push(`/campaign/${currentCampaign}`);
    }
  }, [respError, isError, isSuccess, data, router, campaignCode]);

  return (
    <form className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto space-y-6" onSubmit={handleSubmit}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-500 text-sm mt-2">Sign in to your campaign account</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">Email</label>
          <div className="relative flex items-center">
            <IoMailOutline className="absolute left-3 text-gray-400 text-xl" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="Enter your Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">Password</label>
          <div className="relative flex items-center">
            <IoLockClosedOutline className="absolute left-3 text-gray-400 text-xl" />
            <input
              type={visiblePassword ? 'text' : 'password'}
              className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="Enter your Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <div
              className="absolute right-3 cursor-pointer text-gray-400 hover:text-gray-600 p-1"
              onClick={() => setVisiblePassword(!visiblePassword)}
            >
              {!visiblePassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="remember" className="text-gray-600 cursor-pointer">Remember me</label>
        </div>
        <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">Forgot password?</span>
      </div>

      <button
        className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-gray-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
        type="submit"
        disabled={isPending}
      >
        {isPending ? 'Signing In...' : 'Sign In'}
      </button>

      <p className="text-center text-sm text-gray-600 mt-6">
        Don&apos;t have an account?{' '}
        <Link href={'/campaign/signup'} className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
