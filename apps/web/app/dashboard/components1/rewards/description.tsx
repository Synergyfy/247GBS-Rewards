import { Label } from '@/components/ui/label';
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

function TextareaInput() {
  return <Textarea placeholder="Type your message here." />;
}

const Description = () => {
  return (
    <div className="flex flex-col space-y-6 mt-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="rewards">Rewards</Label>
        <TextareaInput />
      </div>
    </div>
  );
};

export default Description;
