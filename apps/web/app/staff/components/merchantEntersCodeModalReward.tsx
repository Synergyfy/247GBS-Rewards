'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGenerateRewardPoint } from '@/services/hooks/reward/hook';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const MerchantEntersCodeModal = () => {
  const [expires, setExpires] = useState<string>();
  const [rewardId, setRewardId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [campaignId, setCampaignId] = useState<string>('');

  const { rewards } = useSelector((state: RootState) => state.createCampaign);

  useEffect(() => {
    const campaignId = localStorage.getItem('campaignId');
    setCampaignId(campaignId ?? '');
  }, []);

  const handleExpiryValueChange = (value: string) => {
    setExpires(value);
  };

  const handleRewardValueChange = (value: string) => {
    setRewardId(value);
  };

  const { mutate, isSuccess, isPending, data } = useGenerateRewardPoint();

  useEffect(() => {
    if (isSuccess) {
      toast('Code has been generated');
      if (data.code) setGeneratedCode(data.code);
    }
  }, [isSuccess, data]);

  const handleSubmit = () => {
    setErrorMsg('');
    if (!rewardId) {
      setErrorMsg('Please select a reward');
    } else if (!expires) setErrorMsg('Please select an expiry period');
    else {
      mutate({ expires, campaignId, rewardId });
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <DialogTrigger asChild>
          <Button variant="outline">Generate Code</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {"Generate code to enter on customer's device"}
            </DialogTitle>
            <DialogDescription className="text-lg">
              You can use this code for as many customers as you want, as long
              as it is not expired.
            </DialogDescription>
          </DialogHeader>
          {!generatedCode ? (
            <div className="grid gap-4 py-4">
              <Select value={rewardId} onValueChange={handleRewardValueChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select reward" />
                </SelectTrigger>
                <SelectContent>
                  {rewards &&
                    rewards.length > 0 &&
                    rewards.map((reward, i) => (
                      <SelectItem value={reward.id ?? ''} key={i}>
                        {reward.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select
                value={expires as string}
                onValueChange={handleExpiryValueChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select expiry period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Expires in one hour</SelectItem>
                  <SelectItem value="day">Expires in one day</SelectItem>
                  <SelectItem value="week">Expires in one week</SelectItem>
                  <SelectItem value="month">Expires in one month</SelectItem>
                </SelectContent>
              </Select>
              {errorMsg && <p className="text-lg text-red-500">{errorMsg}</p>}
            </div>
          ) : (
            <p className="text-2xl font-medium w-full text-center">
              {generatedCode}
            </p>
          )}
          <DialogFooter>
            {!generatedCode ? (
              <Button type="button" onClick={handleSubmit} disabled={isPending}>
                {isPending ? 'Generating...' : 'Generate'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setGeneratedCode('');
                }}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MerchantEntersCodeModal;
