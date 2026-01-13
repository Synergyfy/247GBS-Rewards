import React from 'react';
import SignupForm from '../components/SignUpForm';

const Page = () => {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
};

export default Page;
