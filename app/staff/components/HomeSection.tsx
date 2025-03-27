'use client';

import { RootState } from '@/store/store';
import React from 'react';
import { useSelector } from 'react-redux';

const HomeSection: React.FC<{
  headerText?: string;
  description?: string;
}> = ({ headerText, description }) => {
  const { homeText, homeTitle, secondaryBg, secondaryText } = useSelector(
    (state: RootState) => state.campaing
  );
  return (
    <section
      className="min-h-[16rem] flex flex-col justify-center space-y-4 sm:pl-[4rem]"
      style={{ backgroundColor: secondaryBg, color: secondaryText }}
    >
      <div className="flex flex-col justify-center space-y-3 sm:w-[40%] px-2 md:px-0">
        <h2 className="text-2xl sm:text-4xl">{headerText || homeText}</h2>
        <p className="sm:text-xl">{description || homeTitle}</p>
      </div>
    </section>
  );
};

export default HomeSection;
