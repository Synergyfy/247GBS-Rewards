'use client';
import { errorType, useSignupCustomer } from '@/services/hooks/auth/hook';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline } from 'react-icons/io5';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');

  const [campaignId, setCampaignId] = useState<string>('');

  useEffect(() => {
    const campaignId = localStorage.getItem('campaignId');
    setCampaignId(campaignId ?? '');
  }, []);

  //sign user up
  const {
    mutate,
    isSuccess,
    isError,
    isPending,
    error: signupError,
  } = useSignupCustomer(campaignId);

  const router = useRouter();
  useEffect(() => {
    if (isError) {
      const error = signupError as unknown as errorType;
      const errorMsg = error.response.data.error;
      setError(errorMsg);
    }

    if (isSuccess) {
      router.push('/campaign/login');
    }
  }, [isError, signupError, isSuccess, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName || !email || !password || !password2) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== password2) {
      setError("Password fields don't match");
      return;
    }

    mutate({ fullName, email, password, password2 });
  };

  return (
    <form className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto space-y-6" onSubmit={handleSubmit}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Create an Account</h2>
        <p className="text-gray-500 text-sm mt-2">Join our loyalty campaign today</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">Fullname</label>
          <div className="relative flex items-center">
            <IoPersonOutline className="absolute left-3 text-gray-400 text-xl" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="Enter your name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          </div>
        </div>

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
              type="password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">Confirm Password</label>
          <div className="relative flex items-center">
            <IoLockClosedOutline className="absolute left-3 text-gray-400 text-xl" />
            <input
              type="password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="Confirm your password"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <button
        className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-gray-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
        type="submit"
        disabled={isPending}
      >
        {isPending ? 'Creating Account...' : 'Sign Up'}
      </button>

      <p className="text-center text-sm text-gray-600 mt-6">
        Have an account already?{' '}
        <Link href={'/campaign/login'} className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
