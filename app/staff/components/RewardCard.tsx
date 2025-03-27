import React from 'react';
import { MdOutlineControlPointDuplicate } from 'react-icons/md';

const RewardBtn = () => {
  return (
    <button className="bg-[#f5f5f5] font-medium h-[3rem] w-full rounded-md shadow-md hover:bg-[#e0e0e0]">
      LOGIN TO REDEEM
    </button>
  );
};

const RewardCard = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md w-[430px] flex flex-col gap-4">
      <div>
        <h2>Test Points</h2>
        <span className="flex items-center gap-2">
          <MdOutlineControlPointDuplicate />
          <p>1,200 points</p>
        </span>
      </div>

      <RewardBtn />
      <p className="leading-relaxed text-opacity-80">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore
      </p>
    </div>
  );
};

export default RewardCard;
