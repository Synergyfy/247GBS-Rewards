'use client';

import React, { useEffect, useState } from 'react';
import HomeSection from '../components/HomeSection';
import CampaignSection from '../components/CampaignSection';
import { useParams } from 'next/navigation';
import { useGetCampaign } from '@/services/hooks/campaign/hook';
import { useDispatch, useSelector } from 'react-redux';
import { updateCampaignField } from '@/store/features/campaign';
import { RootState } from '@/store/store';

const Page = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [currentCampaign, setCurrentCampaign] = useState<string>('');

  const { homeText, homeTitle } = useSelector(
    (state: RootState) => state.campaing
  );

  const campaignCode = (params.code as string) || currentCampaign;

  const { data, isSuccess } = useGetCampaign(campaignCode);

  useEffect(() => {
    const campaign = localStorage.getItem('currentCampaign');
    setCurrentCampaign(campaign ?? '');
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(updateCampaignField({ ...data }));
      localStorage.setItem('currentCampaign', campaignCode);
      localStorage.setItem('campaignId', data.id ?? '');
    }
  }, [isSuccess, data, dispatch, campaignCode]);

  return (
    <div className="w-full">
      <HomeSection headerText={homeTitle} description={homeText} />
      <div className="px-1 w-full sm:px-[7rem] md:px-[10rem] mt-7">
        <CampaignSection />
      </div>
    </div>
  );
};

export default Page;
