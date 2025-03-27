'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useCustomerRedeemNumber } from '@/services/hooks/reward/hook';
import { QRCodeSVG } from 'qrcode.react';
import { RewardMethod } from '@/services/hooks/reward/types';

const QRCodeModal = () => {
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
      mutate({ campaignId, type: RewardMethod.QR });
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
          <Button variant="default">Generate QR Code</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Show QR Code to merchant
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!data && <p>loading...</p>}
            {data?.code && <QRCodeSVG value={data.code} />}
            {errorMsg && <p className="text-lg text-red-500">{errorMsg}</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QRCodeModal;
