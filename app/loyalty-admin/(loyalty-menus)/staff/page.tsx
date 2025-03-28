'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const StaffComponent = dynamic(
  () => import('@/app/dashboard/Content/ProfileManagement/Staff'),
  { ssr: false } // Disable SSR for this component
);

const Page = () => {
  return (
    <div className="sm:w-[80%] mx-auto mt-10 ">
      <h1 className="text-3xl font-bold mb-5">Your Staffs</h1>
      <StaffComponent />
    </div>
  );
};

export default Page;
