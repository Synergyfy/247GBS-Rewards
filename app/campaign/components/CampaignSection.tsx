'use client';
import React from 'react';
import CampaignContent from './CampaignContent';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const CampaignSection = () => {
  const { rewards } = useSelector((state: RootState) => state.campaing);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center sm:text-left">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Rewards</h3>
          <p className="text-gray-500">Explore exclusive rewards waiting for you.</p>
        </div>

        {rewards && rewards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {rewards.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                <div className="mb-4">
                   {/* Placeholder for Reward Icon/Image if available in future */}
                   <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3.24a2 2 0 0 0-.97-1.71l-9-5.4z"/><path d="M15 13a3 3 0 1 0-6 0"/><path d="M12 2v6"/></svg>
                   </div>
                   <h2 className="text-xl font-bold text-gray-900 line-clamp-1" title={item?.title}>{item?.title}</h2>
                </div>

                <div
                  className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow prose prose-sm"
                  dangerouslySetInnerHTML={{
                    __html: item?.description || 'No description available.',
                  }}
                />

                <button className="w-full mt-auto py-2.5 px-4 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm">
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mb-16">
            <p className="text-gray-500 text-lg">No rewards available at the moment.</p>
          </div>
        )}

        <div className="mt-12 pt-12 border-t border-gray-200">
           <CampaignContent />
        </div>
      </div>
    </section>
  );
};

export default CampaignSection;
