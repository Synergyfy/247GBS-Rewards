import React from 'react';
import HomeSection from './components/HomeSection';
import CampaignSection from './components/CampaignSection';

const Page = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      <HomeSection
        headerText="Rewards"
        description="Earn points and choose from these rewards."
      />
      <main className="w-full">
        <CampaignSection />
      </main>
    </div>
  );
};

export default Page;
