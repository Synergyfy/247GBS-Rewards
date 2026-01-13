'use client';

import React from 'react';
import Navbar from '@/components/loyalty-landing/Navbar';
import Hero from '@/components/loyalty-landing/Hero';
import HowItWorks from '@/components/loyalty-landing/HowItWorks';
import RewardsPreview from '@/components/loyalty-landing/RewardsPreview';
import CTA from '@/components/loyalty-landing/CTA';
import Footer from '@/components/loyalty-landing/Footer';

const Page = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-purple-100 selection:text-purple-900">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <RewardsPreview />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Page;
