'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import VoucherManagement from '@/components/VoucherManagement';

const RewardsComponent = dynamic(
  () => import('@/app/dashboard/Content/ProfileManagement/Rewards'),
  { ssr: false } // Disable SSR for this component
);

const Page = () => {
  return (
    <div className="sm:w-[80%] mx-auto mt-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-500 mb-5">Rewards</h1>
        <RewardsComponent />
      </div>
      
      <div className="border-t pt-8">
        <VoucherManagement />
      </div>
    </div>
  );
};

export default Page;
