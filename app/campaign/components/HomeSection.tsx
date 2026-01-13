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
      className="relative py-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center overflow-hidden"
      style={{ backgroundColor: secondaryBg || '#f3f4f6', color: secondaryText || '#111827' }}
    >
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
          {headerText || homeTitle || 'Welcome'}
        </h2>
        <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
          {description || homeText}
        </p>
      </div>

      {/* Decorative background element if needed */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
    </section>
  );
};

export default HomeSection;
