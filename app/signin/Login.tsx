import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { SlArrowLeft } from 'react-icons/sl';
import Link from 'next/link';
import { errorType, useAuth } from '@/services/hooks/auth/hook';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
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
      const errorMsg = error.response.data.error;
      setError(errorMsg);
    } else if (isSuccess) {
      document.cookie = `token=${data.accessToken}; max-age=86400; path=/; secure;`;
      localStorage.setItem('username', data.name);
      router.push('/loyalty-admin');
    }
  }, [respError, isError, isSuccess, data, router]);

  const handleSubmit = () => {
    setError('');
    if (!email || !password) {
      setError('Please enter valid email and password');
    } else mutate({ email, password });
  };
  return (
    <div className="flex justify-center items-center p-10">
      <div className="grid grid-rows-3 grid-cols-3 gap-4 w-full max-w-6xl shadow-lg rounded-lg overflow-hidden">
        <div className="row-span-4 flex items-center justify-center relative w-full h-full">
          <Image
            src="/Login/loginbg.png"
            alt="image"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="grid col-span-2 row-span-3  rounded-lg overflow-hidden px-20 py-4">
          <div className="flex items-center gap-2 cursor-pointer">
            <Link
              href="/landing"
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="text-lg">
                <SlArrowLeft />
              </span>
            </Link>
            <p className="font-light text-sm ml-2">WELCOME BACK</p>
          </div>
          <p className="text-xl font-medium mb-4 ml-10">
            Log in to your Account
          </p>

          <input
            type="email"
            placeholder="Email*"
            className="w-full border p-3 rounded-lg mb-4"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="Password"
            placeholder="Password*"
            className="w-full border p-3 rounded-lg mb-4"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-lg font-medium text-red-600">{error}</p>}
          <div className="flex justify-between items-center p-6 text-sm">
            <div className="flex items-center mb-4">
              <input type="checkbox" className="mr-2" />
              <label>Remember me</label>
            </div>
            <div className="flex items-center mb-4 cursor-pointer">
              <label>Forgot Password?</label>
            </div>
          </div>
          <button
            className="w-full bg-[#000] text-white py-3 rounded-lg"
            onClick={handleSubmit}
          >
            {isPending ? 'Loading...' : 'Continue'}
          </button>
          <div className="relative my-4 flex items-center">
            <div className="w-full border-b"></div>
            <span className="px-4 bg-white">OR</span>
            <div className="w-full border-b"></div>
          </div>
          <button className="w-full flex items-center border justify-center gap-2 text-[#000] py-2 rounded-lg mb-4">
            <FcGoogle className="mr-10" /> Login with Google
          </button>
          <button className="w-full flex items-center border justify-center gap-2 bg-white text-black py-2 rounded-lg mb-4">
            <FaFacebook className="mr-10 " /> Login with Facebook
          </button>
          <Link
            href="/signup"
            className="flex justify-center mt-10 items-center text-sm cursor-pointer"
          >
            New User?
            <span className="text-sm underline cursor-pointer ml-2">
              SIGN UP HERE
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
