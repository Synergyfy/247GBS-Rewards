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
    <div className="flex justify-center items-center min-h-screen p-6 bg-gray-100">
      <div className="grid grid-rows-3 grid-cols-3 gap-4 max-w-4xl w-full overflow-hidden shadow-lg bg-white rounded-lg">
        <div className="row-span-3 flex items-center justify-center relative w-full h-full">
          <Image
            src="/Login/signupbg.png"
            alt="Signup Background"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex flex-col col-span-2 row-span-3 w-full">
          <div className="flex justify-between items-center py-4 px-6 border-b">
            <Link
              href="/landing"
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="text-lg">
                <SlArrowLeft />
              </span>
              <span className="text-sm">Return Home</span>
            </Link>
            <Link href="/signin" className="text-sm cursor-pointer">
              Already a Member?{' '}
              <span className="text-sm font-semibold underline">
                LOG IN NOW
              </span>
            </Link>
          </div>
          <div className="p-6 text-center rounded-lg">
            <h2 className="text-2xl font-bold text-left mb-4">
              Create Account
            </h2>
            <div className="border border-gray-400 px-6 py-4 rounded-lg">
              <button className="w-full flex items-center justify-center gap-2 bg-[#0C82EE] text-white py-2 rounded-full mb-4">
                <FaFacebook /> Sign up with Facebook
              </button>
              <button className="w-full flex items-center justify-center border border-black gap-2 bg-white text-black py-2 rounded-full mb-4">
                <FcGoogle /> Sign up with Google
              </button>
              <div className="relative my-4 flex items-center">
                <div className="w-full border-b"></div>
                <span className="px-4 bg-white">OR</span>
                <div className="w-full border-b"></div>
              </div>
              <h3 className="text-lg font-semibold mb-4">Sign up with Email</h3>
              <form onSubmit={handleSubmit}>
                {(
                  [
                    'fullName',
                    'email',
                    'phoneNumber',
                    'location',
                    'referralCode',
                  ] as Array<keyof FormData>
                ).map((field, index) => (
                  <div key={index} className="mb-4">
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      placeholder={
                        field === 'referralCode'
                          ? 'Referral Code (Optional)'
                          : `${field.replace(/([A-Z])/g, ' $1')}*`
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      className={`w-full border p-2 rounded-lg ${
                        errors[field] ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    {errors[field] && (
                      <p className="text-red-500 text-sm mt-1 text-start">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}
                {apiError && (
                  <p className="text-lg text-red-600 text-start">{apiError}</p>
                )}
                <div className="flex items-center mb-4">
                  <input type="checkbox" className="mr-2" />
                  <label>
                    I agree to the{' '}
                    <span className="underline">Terms of Service</span> and{' '}
                    <span className="underline">Privacy Policy</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-full"
                  disabled={isPending}
                >
                  {isPending ? 'Loading...' : 'Proceed'}
                </button>
              </form>
              <p className="text-center mt-4">
                Already a member?
                <Link href="/signin" className="underline cursor-pointer">
                  {' '}
                  Login
                </Link>
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center p-6 text-sm border-t">
            <span>&copy; 2021 - 2022 FoxHub Inc. All Rights Reserved</span>
            <div className="flex items-center gap-2">
              <span className="cursor-pointer">❓</span>
              <span className="cursor-pointer">Need help?</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
