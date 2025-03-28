import Campaign from '@/app/dashboard/Content/ProfileManagement/Campaign';
import React from 'react';

const Page = () => {
  return (
    <div className="sm:w-[80%] mx-auto mt-10 ">
      <h1 className="text-3xl font-bold mb-5">Campaigns</h1>
      <Campaign />
    </div>
  );
};

export default Page;
