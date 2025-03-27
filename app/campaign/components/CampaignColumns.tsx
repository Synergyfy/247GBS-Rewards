import React from 'react';

const CampaignSection = () => {
  return (
    <section>
      <div>
        <h3 className="text-3xl font-medium">Popular Rewards</h3>

        <div className="bg-white w-[17rem] p-2 mt-4 shadow-md hover:bg-slate-300 cursor-pointer">
          <h2 className="text-xl font-medium">Lorem Ipsium</h2>
          <p className="text-ellipsis text-sm overflow-hidden whitespace-nowrap">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea cobgmmodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore
          </p>
        </div>
      </div>
    </section>
  );
};

export default CampaignSection;
