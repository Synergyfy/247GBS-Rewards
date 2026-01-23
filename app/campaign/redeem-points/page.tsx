'use client';

import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Gift, ArrowRight, Info } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useGetParticipantBalance, useRedeemReward } from '@/services/hooks/customer-campaigns/hook';
import PublicRewardCard from '@/components/rewards/PublicRewardCard';
import { RedemptionSuccessDialog } from '@/components/customer/RedemptionSuccessDialog';
import LoadingSpinner from '@/components/ui/Loading';

export default function RedeemPointsPage() {
  const campaign = useSelector((state: RootState) => state.campaing);
  const router = useRouter();
  const [campaignId, setCampaignId] = useState<string>('');

  useEffect(() => {
    const id = localStorage.getItem('campaignId');
    if (id) setCampaignId(id);
  }, []);

  const { data: balance, isLoading: isBalanceLoading } = useGetParticipantBalance(campaignId);
  const { mutate: redeemReward } = useRedeemReward();

  const userPoints = balance?.balance || 0;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<{ title: string } | null>(null);

  const handleRedeemClick = (reward: any) => {
    const pointsRequired = Number(reward.pointCost || reward.pointsRequired || 0);
    if (userPoints >= pointsRequired) {
      const payload = {
        staffId: 'customer-self-redeem',
        participantId: 'me',
        rewardId: reward.id,
        redemptionCode: `RED-${Date.now()}`,
      };

      redeemReward(payload, {
        onSuccess: () => {
          setSelectedReward(reward);
          setIsDialogOpen(true);
        },
        onError: (error) => {
          console.error('Redemption failed:', error);
          alert('Failed to redeem reward. Please try again.');
        }
      });
    }
  };

  if (isBalanceLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-blue-50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full -ml-16 -mb-16 opacity-30" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                {campaign.redeemTitle || 'Redeem Your Points'}
              </h1>
              <div className="text-lg text-gray-500 leading-relaxed">
                {campaign.redeemText ? (
                  <div dangerouslySetInnerHTML={{ __html: typeof window !== 'undefined' ? DOMPurify.sanitize(campaign.redeemText) : campaign.redeemText }} />
                ) : (
                  <p>Browse through our exclusive rewards and trade your hard-earned points for amazing perks.</p>
                )}
              </div>
            </div>

            <div className="bg-[#2D3DFF] text-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300 min-w-[240px]">
              <div className="flex items-center gap-3 mb-2 opacity-80">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-bold uppercase tracking-wider">Your Balance</span>
              </div>
              <div className="text-5xl font-black">{userPoints}</div>
              <div className="text-xs font-bold mt-2 uppercase tracking-widest opacity-60">Loyalty Points</div>
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div id="rewards-section" className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Gift className="w-8 h-8 text-[#2D3DFF]" />
              Available Rewards
            </h2>
            <span className="bg-white px-4 py-2 rounded-full text-sm font-bold text-gray-500 shadow-sm border border-gray-100">
              {campaign.rewards?.length || 0} ITEMS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaign.rewards && campaign.rewards.length > 0 ? (
              campaign.rewards.map((reward: any) => (
                <PublicRewardCard
                  key={reward.id}
                  reward={reward}
                  userPoints={userPoints}
                  isMember={true}
                  onRedeem={() => handleRedeemClick(reward)}
                  className="h-full"
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-900">No rewards available yet</h3>
                <p className="text-gray-500 mt-2">Check back soon for new exclusive offers!</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-blue-50/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-blue-800">
            <Info className="w-6 h-6 shrink-0" />
            <p className="font-medium text-sm">Points redeemed for rewards are non-refundable. Please review the reward details before claiming.</p>
          </div>
          <Button variant="ghost" className="text-[#2D3DFF] font-bold flex items-center gap-2 group">
            Terms of Service <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {selectedReward && (
        <RedemptionSuccessDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          rewardTitle={selectedReward.title}
        />
      )}
    </div>
  );
}
