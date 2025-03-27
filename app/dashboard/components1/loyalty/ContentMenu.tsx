import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

const ContentMenu = () => {
  return (
    <div className="flex flex-col space-y-6 mt-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="top-title">Top title</Label>
        <Input type="email" id="top-title" placeholder="Top Title" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="headline">Headline</Label>
        <Input type="email" id="headline" placeholder="Headline" />
      </div>
    </div>
  );
};

export default ContentMenu;
