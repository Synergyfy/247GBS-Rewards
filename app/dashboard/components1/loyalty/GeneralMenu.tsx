import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

const GeneralMenu = () => {
  const generalForm = [
    { name: 'Business', label: 'Business' },
    { name: 'Campaign Name', label: 'Campaign Name' },
    { name: 'Points Customers Receive', label: 'Points' },
  ];
  return (
    <div className="w-full">
      <div className="flex flex-col space-y-6 mt-4">
        {generalForm.map((item, i) => {
          return (
            <div className="grid w-full max-w-sm items-center gap-1.5" key={i}>
              <Label htmlFor="business" className="text-xl">
                {item.name}
              </Label>
              <Input type="email" id="business" placeholder={item.label} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GeneralMenu;
