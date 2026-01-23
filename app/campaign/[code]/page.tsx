'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetCampaign } from '@/services/hooks/campaign/hook';
import { useDispatch } from 'react-redux';
import { updateCampaignField } from '@/store/features/campaign';
import CampaignDetailPage from '../page';
import LoadingSpinner from '@/components/ui/Loading';

const Page = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  const campaignCode = params.code as string;

  const { data, isSuccess, isLoading } = useGetCampaign(campaignCode);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(updateCampaignField({ ...data }));
      localStorage.setItem('currentCampaign', campaignCode);
      localStorage.setItem('campaignId', data.id ?? '');
      setIsReady(true);
    }
  }, [isSuccess, data, dispatch, campaignCode]);

  if (isLoading || !isReady) {
    return <LoadingSpinner />;
  }

  return <CampaignDetailPage />;
};

export default Page;
