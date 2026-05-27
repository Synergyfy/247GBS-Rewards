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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useGeneratePoint } from '@/services/hooks/reward/hook';
import { toast } from 'sonner';
import CodeContainer from '@/app/campaign/components/CodeContainer';

const MerchantEntersCodeModal = () => {
  const [points, setPoints] = useState('0');
  const [expires, setExpires] = useState<string>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [campaignId, setCampaignId] = useState<string>('');

  useEffect(() => {
    const campaignId = localStorage.getItem('campaignId');
    setCampaignId(campaignId ?? '');
  }, []);

  const handlePointInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setPoints(numericValue);
  };

  const handleExpiryValueChange = (value: string) => {
    setExpires(value);
    console.log('Selected value:', value);
  };

  const { mutate, isSuccess, isPending, data } = useGeneratePoint();

  useEffect(() => {
    if (isSuccess) {
      toast('Code has been generated');
      if (data.code) setGeneratedCode(data.code);
    }
  }, [isSuccess, data]);

  const handleSubmit = () => {
    setErrorMsg('');
    if (+points <= 0) {
      setErrorMsg('Points to be credited can not be less than 0');
    } else if (!expires) setErrorMsg('Please select and expiry period');
    else {
      mutate({ points: +points, expires, type: '2', campaignId });
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
              <div className="flex flex-col gap-4">
                <Label htmlFor="points" className="text-lg">
                  Points to be credited
                </Label>
                <Input
                  id="points"
                  value={points}
                  onChange={handlePointInputChange}
                  className="text-lg font-medium"
                />
              </div>
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
            <CodeContainer code={generatedCode} />
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
