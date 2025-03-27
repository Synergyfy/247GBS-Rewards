'use client';

import React, { useEffect, useState } from 'react';
import HomeSection from '../components/HomeSection';
import { useParams, useRouter } from 'next/navigation';
import { useGetCampaign } from '@/services/hooks/campaign/hook';
import { useDispatch, useSelector } from 'react-redux';
import { updateCampaignField } from '@/store/features/campaign';
import History from '../components/History';
import { RootState } from '@/store/store';
import { getCookieValue } from '@/services/getCookieValue';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentCampaign, setCurrentCampaign] = useState<string>('');

  const campaignCode = (params.code as string) || currentCampaign;

  const { homeText, homeTitle } = useSelector(
    (state: RootState) => state.campaing
  );

  useEffect(() => {
    const campaign = localStorage.getItem('currentCampaign');
    setCurrentCampaign(campaign ?? '');

    const token = getCookieValue('staffToken');
    if (!token) router.push('/staff/login');
  }, []);

  const { data, isSuccess } = useGetCampaign(campaignCode);

  useEffect(() => {
    if (isSuccess) {
      dispatch(updateCampaignField({ ...data }));
      localStorage.setItem('currentCampaign', campaignCode);
      localStorage.setItem('campaignId', data.id ?? '');
    }
  }, [isSuccess, data, dispatch, campaignCode]);

  return (
    <div className="w-full ">
      <HomeSection headerText={homeTitle} description={homeText} />
      <section className="w-full flex items-center justify-center mt-5">
        <div className="bg-white w-[40rem]">
          <header className="flex gap-3 font-medium border-b h-[3rem] items-center px-2 cursor-pointer">
            CAMPAIGN HISTORY
          </header>

          <div className="p-5">
            <History />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
