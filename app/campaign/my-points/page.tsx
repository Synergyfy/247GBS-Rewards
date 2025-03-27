'use client';
import React, { useEffect, useState } from 'react';
import HomeSection from '../components/HomeSection';
import { useRouter } from 'next/navigation';
import { getCookieValue } from '@/services/getCookieValue';
import History from '../components/History';
import { useGetPointBalance } from '@/services/hooks/reward/hook';

const Page = () => {
  const router = useRouter();

  const [isBalance, setIsBalance] = useState<boolean>(true);

  const [campaignId, setCampaignId] = useState<string>('');

  useEffect(() => {
    const campaignId = localStorage.getItem('campaignId');
    setCampaignId(campaignId ?? '');
  }, []);

  const { data, isLoading, isError } = useGetPointBalance(campaignId);

  useEffect(() => {
    const tokenOwner = getCookieValue('tokenOwner');
    const token = getCookieValue('customerToken');
    const currentCampaign = localStorage.getItem('currentCampaign');

    if (!token || tokenOwner !== currentCampaign) {
      router.push('/campaign/login');
    }
  }, [router]);

  return (
    <div>
      <HomeSection />
      <section className="w-full flex items-center justify-center mt-5">
        <div className="bg-white w-[40rem]">
          <header className="flex gap-3 font-medium border-b h-[3rem] items-center px-2 cursor-pointer">
            <span
              className={`h-full flex items-center ${
                isBalance ? 'border-b-2 border-black' : ''
              }`}
              onClick={() => setIsBalance(true)}
            >
              BALANCE
            </span>
            <span
              className={`h-full flex items-center ${
                !isBalance ? 'border-b-2 border-black' : ''
              }`}
              onClick={() => setIsBalance(false)}
            >
              HISTORY
            </span>
          </header>

          <div className="p-5">
            {isBalance ? (
              <p className="text-3xl">
                {isLoading
                  ? 'Loading...'
                  : isError
                  ? 'Error'
                  : `${data ?? ''} Points`}
              </p>
            ) : (
              <History />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
