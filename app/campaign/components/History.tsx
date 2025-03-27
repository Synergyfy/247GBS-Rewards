'use client';

import { formatDate } from '@/app/helpers/formatDate';
import {
  useGetPointsHistory,
  useGetRewardHistory,
} from '@/services/hooks/reward/hook';
import React, { useEffect, useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';

const History = () => {
  const [isPoints, setIsPoints] = useState<boolean>(true);

  const [campaignId, setCampaignId] = useState<string>('');

  useEffect(() => {
    const campaignId = localStorage.getItem('campaignId');
    setCampaignId(campaignId ?? '');
  }, []);

  const PointsHistory = () => {
    const { data } = useGetPointsHistory(campaignId);

    if (!data) {
      return <p>Loading...</p>;
    }

    return (
      <div>
        {data.map((point, i) => (
          <div
            className="h-[5rem] border-b flex gap-0 items-center justify-start px-2"
            key={i}
          >
            <div className="min-w-[3rem] min-h-[3rem] rounded-full bg-orange-600 text-white flex items-center justify-center">
              <BsEmojiSmile />
            </div>
            <div>
              <p className="font-medium text-lg ml-5">
                +{point.points} points, {formatDate(point.created_at)}
              </p>
              <p className="text-sm ml-5">{point.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const RewardHistory = () => {
    const { data } = useGetRewardHistory(campaignId);

    if (!data) {
      return <p>Loading...</p>;
    }

    return (
      <div>
        {data.map((reward, i) => (
          <div
            className="h-[5rem] border-b flex gap-0 items-center justify-start px-2"
            key={i}
          >
            <div className="min-w-[3rem] min-h-[3rem] py-2 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <BsEmojiSmile />
            </div>
            <div>
              <p className="font-medium ml-5">
                {reward.reward?.title ?? ''} reward,{' '}
                {formatDate(reward.created_at)}
              </p>
              <p className="text-sm ml-5">{reward.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <header className="flex gap-3 font-medium border-b h-[3rem] items-center px-2 cursor-pointer">
        <span
          className={`h-full flex items-center ${
            isPoints ? 'border-b-2 border-black' : ''
          }`}
          onClick={() => setIsPoints(true)}
        >
          POINTS
        </span>
        <span
          className={`h-full flex items-center ${
            !isPoints ? 'border-b-2 border-black' : ''
          }`}
          onClick={() => setIsPoints(false)}
        >
          REWARDS
        </span>
      </header>

      <div className="p-5">
        {isPoints ? <PointsHistory /> : <RewardHistory />}
      </div>
    </div>
  );
};

export default History;
