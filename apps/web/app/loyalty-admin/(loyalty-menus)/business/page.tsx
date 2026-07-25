'use client';

import React from 'react';

import dynamic from 'next/dynamic';

const BusinessesComponent = dynamic(
  () => import('@/app/dashboard/Content/ProfileManagement/Businesses'),
  { ssr: false } // Disable SSR for this component
);

const Page = () => {
  return (
    <div className="sm:w-[80%] mx-auto mt-10 ">
      <h1 className="text-3xl font-bold mb-5">Your Businesses</h1>
      <BusinessesComponent />
    </div>
  );
};

export default Page;
