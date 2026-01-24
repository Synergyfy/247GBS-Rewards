'use client';

import React from 'react';

import dynamic from 'next/dynamic';

const CampaignComponent = dynamic(
  () => import('@/app/dashboard/Content/ProfileManagement/Campaign'),
  { ssr: false } // Disable SSR for this component
);

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const CampaignList = () => {
  const searchParams = useSearchParams();
  const filterType = searchParams.get('type') || 'ALL';

  return (
    <div className="sm:w-[80%] mx-auto mt-10 ">
      <h1 className="text-3xl font-bold mb-5">Campaigns</h1>
      <CampaignComponent filterProp={filterType} />
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading campaigns...</div>}>
      <CampaignList />
    </Suspense>
  );
};

export default Page;
