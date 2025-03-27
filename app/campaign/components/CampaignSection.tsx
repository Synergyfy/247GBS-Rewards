'use client';
import React from 'react';
import CampaignContent from './CampaignContent';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const CampaignSection = () => {
  const { rewards } = useSelector((state: RootState) => state.campaing);
  return (
    <section>
      <div>
        <h3 className="text-3xl font-medium">Rewards</h3>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap items-center">
          {rewards?.map((item, i) => {
            return (
              <div
                key={i}
                className="bg-white w-[17rem] p-2 mt-4 shadow-md hover:bg-slate-300 cursor-pointer"
              >
                <h2 className="text-xl font-medium">{item?.title}</h2>
                <p
                  className="text-ellipsis text-sm overflow-hidden whitespace-nowrap"
                  dangerouslySetInnerHTML={{
                    __html: item?.description || '',
                  }}
                ></p>
              </div>
            );
          })}
        </div>

        <CampaignContent />
      </div>
    </section>
  );
};

export default CampaignSection;
