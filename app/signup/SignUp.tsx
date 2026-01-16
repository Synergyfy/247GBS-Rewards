'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { SlArrowLeft } from 'react-icons/sl';
import Link from 'next/link';
import { errorType, useSignup } from '@/services/hooks/auth/hook';
import { useRouter } from 'next/navigation';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  referralCode: string;
}

interface Errors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  referralCode?: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    referralCode: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState<string>('');

  const {
    isSuccess,
    isPending,
    isError,
    data,
    error: respError,
    mutate,
  } = useSignup();

  const router = useRouter();

  useEffect(() => {
    if (isError) {
      const error = respError as unknown as errorType;
      setApiError(error.response.data.error);
    } else if (isSuccess) {
      router.push('/signin');
    }
  }, [respError, isError, isSuccess, data, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    const newErrors: Errors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'referralCode' && !formData[key as keyof FormData]) {
        newErrors[key as keyof Errors] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log('Form Data:', formData);
      mutate(formData);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white text-slate-900 overflow-hidden relative selection:bg-blue-500/10">
      {/* Visual Side (Left) */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="/Login/signupbg.png"
            alt="Dashboard"
            layout="fill"
            objectFit="cover"
            priority
            className="scale-105"
          />
        </div>

        {/* Ambient Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />

        {/* Content on visual side */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-20 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/30 mb-8 -rotate-3 transition-transform hover:rotate-0">
            <span className="text-white font-black text-4xl">G</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">
            Start Your Journey <br /> With 247GBS
          </h2>
          <p className="text-xl text-slate-600 font-medium max-w-md">
            The all-in-one system designed to grow your business automatically.
          </p>
        </div>
      </div>

      {/* SignUp Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-24 relative z-20 bg-white overflow-y-auto py-20">
        <div className="w-full max-w-md space-y-8 relative">
          {/* Back Button */}
          <Link
            href="/"
            className="absolute -top-16 left-0 inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold group"
          >
            <SlArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Login Link */}
          <div className="absolute -top-16 right-0 text-sm font-medium text-slate-600">
            Already a member?{' '}
            <Link href="/signin" className="text-blue-600 font-bold hover:underline">
              LOG IN NOW
            </Link>
          </div>

          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Create <span className="text-blue-600">Account</span>
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Join the growth engine today.
            </p>
          </div>

          <div className="space-y-6">
            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all font-bold text-sm">
                <FcGoogle size={20} /> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1877F2] text-white hover:bg-[#166fe5] transition-all font-bold text-sm">
                <FaFacebook size={18} /> Facebook
              </button>
            </div>

            <div className="relative flex items-center">
              <div className="w-full border-b border-slate-100"></div>
              <span className="px-4 bg-white text-slate-400 text-xs font-bold tracking-widest uppercase">Or</span>
              <div className="w-full border-b border-slate-100"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {apiError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                  {apiError}
                </div>
              )}

              {(
                [
                  'fullName',
                  'email',
                  'phoneNumber',
                  'location',
                  'referralCode',
                ] as Array<keyof FormData>
              ).map((field) => (
                <div key={field}>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    placeholder={
                      field === 'referralCode'
                        ? 'Referral Code (Optional)'
                        : `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}*`
                    }
                    value={formData[field]}
                    onChange={handleChange}
                    className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all ${errors[field] ? 'border-red-500' : 'border-slate-200 focus:border-blue-500/50'
                      }`}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-xs mt-1 font-bold ml-2">
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex items-start gap-3 py-2">
                <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" required />
                <label htmlFor="terms" className="text-sm text-slate-600 font-medium">
                  I agree to the <span className="text-blue-600 font-bold hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 font-bold hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 text-lg"
              >
                {isPending ? 'Processing...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center w-full text-xs text-slate-400 font-bold uppercase tracking-widest">
          &copy; 2026 247GBS Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Signup;
