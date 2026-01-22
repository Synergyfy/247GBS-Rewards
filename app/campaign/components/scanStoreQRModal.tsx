'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ScanStoreQRModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>How to Scan</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Scan Store QR Code</DialogTitle>
          <DialogDescription className="text-lg pt-4">
            Look for the QR code displayed at the store counter or on
            promotional materials.
            <br />
            <br />
            Open your phone camera or a QR code scanner app and scan the code to
            instantly earn your points.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ScanStoreQRModal;
