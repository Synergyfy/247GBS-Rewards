import Businesses from '@/app/dashboard/Content/ProfileManagement/Businesses';
import React from 'react';

const Page = () => {
  return (
    <div className="sm:w-[80%] mx-auto mt-10 ">
      <h1 className="text-3xl font-bold mb-5">Your Businesses</h1>
      <Businesses />
    </div>
  );
};

export default Page;
