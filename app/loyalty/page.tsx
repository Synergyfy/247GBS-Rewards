import React from 'react';
import MenuBg from '@/public/loyalty/bgImgs/menuBg.png';
import Image from 'next/image';
import { HomepageToDashboard } from './components/buttons/buttons';

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <header className="w-[60%] mx-auto h-fit flex flex-col items-center justify-center text-center gap-2">
        <h1 className="text-4xl font-semibold tracking-wide leading-[3rem] text-center mt-20">
          Run exciting campaigns, engage customers, and boost sales with our
          powerful loyalty platform. Turn shoppers into super fans!
        </h1>
        <h3 className="w-[50%] text-lg">
          Create tailored reward programs in minutes, with flexible point
          systems, tiered rewards, and exclusive perks that match your brand’s
          goals.
        </h3>

        <HomepageToDashboard />
      </header>

      <section className="border mt-5">
        <Image
          src={MenuBg}
          alt="menu background"
          className="w-[100%] h-[100%] object-cover"
          loading="lazy"
        />
      </section>
    </div>
  );
};

export default Page;
