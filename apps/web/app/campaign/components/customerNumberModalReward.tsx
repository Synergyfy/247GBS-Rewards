'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useCustomerRedeemNumber } from '@/services/hooks/reward/hook';
import CodeContainer from './CodeContainer';
import { RewardMethod } from '@/services/hooks/reward/types';

const CustomerNumberModal = () => {
  const [errorMsg, setErrorMsg] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasMutated, setHasMutated] = useState<boolean>(false);
  const [campaignId, setCampaignId] = useState<string>('');

  useEffect(() => {
    const campaignId = localStorage.getItem('campaignId');
    setCampaignId(campaignId ?? '');
  }, []);

  const { mutate, data, isError } = useCustomerRedeemNumber();

  useEffect(() => {
    if (isOpen && !hasMutated) {
      mutate({ campaignId, type: RewardMethod.CustomerNumber });
      setHasMutated(true);
    }
  }, [isOpen, mutate, hasMutated, campaignId]);

  useEffect(() => {
    if (isError) {
      setErrorMsg('An error occurred, please try again');
    }
  }, [isError]);

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          setIsOpen(!isOpen);
          setHasMutated(false);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="default">Generate number</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Enter Code</DialogTitle>
            <DialogDescription className="text-lg">
              Give this number to the merchant.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {data ? (
              <CodeContainer code={data?.code ?? ''} />
            ) : (
              <p>loading...</p>
            )}

            {errorMsg && <p className="text-lg text-red-500">{errorMsg}</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerNumberModal;
