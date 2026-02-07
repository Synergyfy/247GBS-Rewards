'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import VoucherManagement from '@/components/VoucherManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RewardsComponent = dynamic(
  () => import('@/app/dashboard/Content/ProfileManagement/Rewards'),
  { ssr: false } // Disable SSR for this component
);

const Page = () => {
  return (
    <div className="sm:w-[80%] mx-auto mt-10 space-y-8">
      <h1 className="text-3xl font-semibold text-gray-500 mb-5">Rewards</h1>
      
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="vouchers">Voucher Management</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory" className="mt-6">
          <RewardsComponent />
        </TabsContent>
        <TabsContent value="vouchers" className="mt-6">
          <VoucherManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
