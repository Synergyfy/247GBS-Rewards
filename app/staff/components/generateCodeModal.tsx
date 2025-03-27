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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGeneratePoint, useGetCodes } from '@/services/hooks/reward/hook';
import { toast } from 'sonner';
import { formatDate } from '@/app/helpers/formatDate';

const GenerateCodeModal = () => {
  const [points, setPoints] = useState('0');
  const [expires, setExpires] = useState<string>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showCodes, setShowCodes] = useState(false);

  const [campaignId, setCampaignId] = useState<string>('');

  useEffect(() => {
    const campaignId = localStorage.getItem('campaignId');
    setCampaignId(campaignId ?? '');
  }, []);

  const handleExpiryValueChange = (value: string) => {
    setExpires(value);
  };

  const handlePointInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setPoints(numericValue);
  };

  const { mutate, isSuccess, isPending } = useGeneratePoint();

  const { data, refetch } = useGetCodes(campaignId);

  useEffect(() => {
    if (isSuccess) {
      toast('Code has been generated');
      refetch();
      setIsOpen(false);
    }
  }, [isSuccess, refetch]);

  const handleSubmit = () => {
    setErrorMsg('');
    if (+points <= 0) {
      setErrorMsg('Points to be credited can not be less than 0');
    } else if (!expires) setErrorMsg('Please select and expiry period');
    else {
      mutate({ points: +points, expires, type: '1', campaignId });
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
            <div className="w-full border-b border-black flex gap-3 font-medium text-lg py-3 cursor-pointer">
              <p
                onClick={() => setShowCodes(false)}
                className={`${
                  !showCodes && 'border-b-2 border-blue-800 underline-offset-2 '
                }`}
              >
                Generate Code
              </p>
              <p
                onClick={() => setShowCodes(true)}
                className={`${
                  showCodes && 'border-b-2 border-blue-800 underline-offset-2 '
                }`}
              >
                Active Codes
              </p>
            </div>
            <DialogTitle className="text-xl">
              {!showCodes
                ? 'Generate code to give to customer'
                : 'Give code to customer'}
            </DialogTitle>
            {!showCodes && (
              <DialogDescription className="text-lg">
                Generate a code you can give to the customer. This code can be
                used only once.
              </DialogDescription>
            )}
          </DialogHeader>
          {!showCodes && (
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
          )}

          {showCodes && (
            <div className="flex flex-col gap-2 max-h-[30rem] overflow-y-auto">
              {data &&
                data?.length > 0 &&
                data.map((item, i) => (
                  <span
                    key={i}
                    className="border-l-2 border-black flex flex-col gap-1 pl-2"
                  >
                    <p className="text-lg font-medium">{item.code}</p>
                    <p>Points: {item.points}</p>
                    {item.expiry && (
                      <span className="flex flex-col">
                        <p>Valid until:</p>
                        <p className="italic text-base">
                          {formatDate(item.expiry)}
                        </p>
                      </span>
                    )}
                  </span>
                ))}
            </div>
          )}

          {!showCodes && (
            <DialogFooter>
              <Button type="button" onClick={handleSubmit} disabled={isPending}>
                {isPending ? 'Generating...' : 'Generate'}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerateCodeModal;
