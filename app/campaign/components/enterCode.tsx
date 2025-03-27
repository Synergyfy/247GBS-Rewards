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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useValidateCode } from '@/services/hooks/reward/hook';
import { toast } from 'sonner';
import { errorType } from '@/services/hooks/auth/hook';

const VerifyCodeModal = () => {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [campaignId, setCampaignId] = useState<string>('');

  useEffect(() => {
    const campaignId = localStorage.getItem('campaignId');
    setCampaignId(campaignId ?? '');
  }, []);

  const handleCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    let numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue.length > 9) {
      numericValue = numericValue.slice(0, 9);
    }

    let formattedValue = '';
    for (let i = 0; i < numericValue.length; i++) {
      if (i > 0 && i % 3 === 0) {
        formattedValue += '-';
      }
      formattedValue += numericValue[i];
    }

    setCode(formattedValue);
  };
  const { mutate, isSuccess, isPending, isError, error } = useValidateCode();

  useEffect(() => {
    if (isSuccess) {
      toast('You have received your points.');
      setIsOpen(false);
    }
    if (isError) {
      const err = error as unknown as errorType;
      const errorMsg = err.response.data.error;
      setErrorMsg(errorMsg);
    }
  }, [isSuccess, isError, error]);

  const handleSubmit = () => {
    setErrorMsg('');
    if (!code || code.length < 11) {
      setErrorMsg('Enter a valid 9 digits code');
    } else {
      mutate({ code, campaignId, type: '1' });
    }
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <DialogTrigger asChild>
          <Button>Enter Code</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Enter Code</DialogTitle>
            <DialogDescription className="text-lg">
              Please enter the code you received from the merchant below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="points" className="text-lg">
                Enter 9 digits <code></code>
              </Label>
              <Input
                id="points"
                placeholder="xxx-xxx-xxx"
                value={code}
                onChange={handleCodeInputChange}
                className="text-lg font-medium"
              />
            </div>

            {errorMsg && <p className="text-lg text-red-500">{errorMsg}</p>}
          </div>

          <DialogFooter>
            <Button type="button" onClick={handleSubmit} disabled={isPending}>
              {isPending ? 'Verifying...' : 'Verify'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerifyCodeModal;
