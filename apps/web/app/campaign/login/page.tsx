import React, { Suspense } from 'react';
import LoginForm from '../components/LoginForm';

const Page = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[40rem]">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
