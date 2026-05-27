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
import { useValidatCustomerNumber } from '@/services/hooks/reward/hook';
import { errorType } from '@/services/hooks/auth/hook';
import QRCodeScanner from '@/app/dashboard/Content/Dashboard/QRCodeScanner';
import { RewardMethod } from '@/services/hooks/reward/types';

const ScanQRModal = () => {
  const [points, setPoints] = useState('0');
  const [customerNumber, setCustomerNumber] = useState('');
  const [errMsg, setErrMsg] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate, isPending, isSuccess, isError, error } =
    useValidatCustomerNumber();

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

  const handlePointInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setPoints(numericValue);
  };

  const handleSubmit = () => {
    if (!customerNumber || customerNumber.length < 11) {
      setErrMsg('Please scan a QR code to credit a customer');
      return;
    }
    if (+points <= 0) {
      setErrMsg('Points to be credited can not be less than 0');
    } else {
      mutate({ points, customerNumber, type: RewardMethod.QR });
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
              Enter the amount of points and a customer number to credit the
              customer.
            </DialogDescription>
          </DialogHeader>
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

            {!customerNumber ? (
              <QRCodeScanner
                setScannedResult={result => setCustomerNumber(result || '')}
              />
            ) : (
              <p className="text-2xl font-medium text-center">
                {customerNumber}
              </p>
            )}
          </div>

          {errMsg && <p className="text-lg text-red-500">{errMsg}</p>}
          <DialogFooter>
            {customerNumber && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCustomerNumber('');
                  setPoints('0');
                }}
                disabled={isPending}
              >
                Scan again
              </Button>
            )}
            <Button type="button" onClick={handleSubmit} disabled={isPending}>
              {isPending ? 'Crediting...' : 'Credit Customer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScanQRModal;
