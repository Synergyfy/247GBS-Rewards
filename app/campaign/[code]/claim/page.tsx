'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useValidateCode } from '@/services/hooks/reward/hook';
import { useGetCampaign } from '@/services/hooks/campaign/hook';
import { getCookieValue } from '@/services/getCookieValue';
import { errorType } from '@/services/hooks/auth/hook';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ClaimPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const campaignCode = params.code as string;
  const triggerCode = searchParams.get('code');

  const [hasTriggered, setHasTriggered] = useState(false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    data: campaign,
    isSuccess: isCampaignSuccess,
    isError: isCampaignError,
  } = useGetCampaign(campaignCode);
  const { mutate, isSuccess, isError, error } = useValidateCode();

  useEffect(() => {
    // Check authentication
    const token = getCookieValue('customerToken');

    if (!token) {
      const currentUrl = window.location.href;
      // Encode the current URL to pass as a redirect parameter
      const redirectUrl = encodeURIComponent(currentUrl);
      router.push(`/campaign/login?redirect=${redirectUrl}`);
      return;
    }

    if (isCampaignError) {
      setStatus('error');
      setErrorMessage('Campaign not found.');
      return;
    }

    if (
      isCampaignSuccess &&
      campaign?.id &&
      triggerCode &&
      !hasTriggered &&
      token
    ) {
      setHasTriggered(true);
      mutate({
        code: triggerCode,
        campaignId: campaign.id,
        type: '1', // '1' corresponds to user claiming points
      });
    } else if (!triggerCode && isCampaignSuccess) {
      setStatus('error');
      setErrorMessage('No reward code provided.');
    }
  }, [
    isCampaignSuccess,
    isCampaignError,
    campaign,
    triggerCode,
    hasTriggered,
    mutate,
    router,
  ]);

  useEffect(() => {
    if (isSuccess) {
      setStatus('success');
      // Update local storage if needed, similar to login flow
      if (campaignCode) {
        localStorage.setItem('currentCampaign', campaignCode);
      }
      if (campaign?.id) {
        localStorage.setItem('campaignId', campaign.id);
      }
    }
  }, [isSuccess, campaignCode, campaign]);

  useEffect(() => {
    if (isError) {
      setStatus('error');
      const err = error as unknown as errorType;
      const msg =
        err?.response?.data?.error ||
        'An error occurred while claiming your reward.';
      setErrorMessage(msg);
    }
  }, [isError, error]);

  const handleGoHome = () => {
    router.push(`/campaign/${campaignCode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold">Claiming your reward...</h2>
            <p className="text-gray-500">Please wait while we verify your code.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Reward Claimed!
            </h2>
            <p className="text-gray-600 mb-6">
              You have successfully received your points.
            </p>
            <Button onClick={handleGoHome} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-3xl">
              ✕
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Claim Failed
            </h2>
            <p className="text-red-500 mb-6">{errorMessage}</p>
            <Button onClick={handleGoHome} variant="outline" className="w-full">
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimPage;
