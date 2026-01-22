import React, { Suspense } from 'react';
import SignupForm from '../components/SignUpForm';

const Page = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[40rem]">
        <Suspense fallback={<div>Loading...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
