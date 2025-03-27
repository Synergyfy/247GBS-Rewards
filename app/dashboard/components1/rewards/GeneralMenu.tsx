import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

const GeneralMenu = () => {
  return (
    <div>
      <div className="flex flex-col space-y-6 mt-4">
        <div className="grid w-full max-w-sm items-center mt-4 gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input type="text" id="title" placeholder="Title (required)" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="point-cost">Point Cost</Label>
          <Input
            type="text"
            id="point-cost"
            placeholder="Point Cost (Required)"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="rewardValue">Reward Value</Label>
          <Input
            type="text"
            id="rewardValue"
            placeholder="Reward Value (required)"
            className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralMenu;
