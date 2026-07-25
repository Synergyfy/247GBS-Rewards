import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

const Rewards = () => {
  return (
    <div className="flex flex-col space-y-6 mt-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="rewards">Rewards</Label>
        <Input type="text" id="top-title" placeholder="rewards" />
      </div>
    </div>
  );
};

export default Rewards;
