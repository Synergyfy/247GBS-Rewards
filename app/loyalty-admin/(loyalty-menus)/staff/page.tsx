import Staff from '@/app/dashboard/Content/ProfileManagement/Staff';
import React from 'react';

const Page = () => {
  return (
    <div className="sm:w-[80%] mx-auto mt-10 ">
      <h1 className="text-3xl font-bold mb-5">Your Staffs</h1>
      <Staff />
    </div>
  );
};

export default Page;
