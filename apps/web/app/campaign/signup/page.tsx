import React from 'react';
import SignupForm from '../components/SignUpForm';

const Page = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[40rem]">
        <SignupForm />
      </div>
    </div>
  );
};

export default Page;
