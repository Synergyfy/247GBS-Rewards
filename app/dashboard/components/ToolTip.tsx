import React from 'react';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { BsExclamation } from 'react-icons/bs';

const ToolTip: React.FC<{ content: string }> = ({ content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="bg-gray-600 text-white italic rounded-full">
            <BsExclamation />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-[10rem]">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolTip;
