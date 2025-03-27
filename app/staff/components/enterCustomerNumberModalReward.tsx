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
import { useValidatCustomerRedeemNumber } from '@/services/hooks/reward/hook';
import { errorType } from '@/services/hooks/auth/hook';
import { RewardMethod } from '@/services/hooks/reward/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

const EnterCustomerNumberModal = () => {
  const { rewards } = useSelector((state: RootState) => state.campaing);
  const [customerNumber, setCustomerNumber] = useState('');
  const [errMsg, setErrMsg] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rewardId, setRewardId] = useState<string>('');

  const { mutate, isPending, isSuccess, isError, error } =
    useValidatCustomerRedeemNumber();

  const handleRewardValueChange = (value: string) => {
    setRewardId(value);
  };

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false);
    }
    if (isError) {
      const errorData = error as unknown as errorType;
      const errorMsg = errorData.response.data.error;
      setErrMsg(errorMsg);
    }
  }, [isSuccess, isError, error]);

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

    setCustomerNumber(formattedValue);
  };

  const handleSubmit = () => {
    if (!rewardId) {
      setErrMsg('Please select a reward');
    } else if (!customerNumber || customerNumber.length < 11) {
      setErrMsg('Please enter a valid customer number');
    } else if (!rewardId) {
      setErrMsg('Please select a reward');
    } else {
      mutate({ customerNumber, type: RewardMethod.CustomerNumber, rewardId });
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <DialogTrigger asChild>
          <Button variant="outline">Credit Customer</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Credit a customer with number
            </DialogTitle>
            <DialogDescription className="text-lg">
              Enter customer number and select a reward
            </DialogDescription>
          </DialogHeader>
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

            <div className="flex flex-col gap-4">
              <Label htmlFor="points" className="text-lg">
                {"Customer's Number"}
              </Label>
              <Input
                id="points"
                value={customerNumber}
                onChange={handleCodeInputChange}
                className="text-lg font-medium"
                placeholder={"Enter customer's number"}
              />
            </div>
          </div>

          {errMsg && <p className="text-lg text-red-500">{errMsg}</p>}
          <DialogFooter>
            <Button type="button" onClick={handleSubmit} disabled={isPending}>
              {isPending ? 'Crediting...' : 'Credit Customer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnterCustomerNumberModal;
