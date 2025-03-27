import React from 'react';
import LoginForm from '../components/LoginForm';

const Page = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[40rem]">
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
