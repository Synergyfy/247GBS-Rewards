'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCookieValue } from '@/services/getCookieValue';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import LoadingSpinner from '@/components/ui/Loading';
import { useCheckCampaignJoinStatus, useJoinCampaign } from '@/services/hooks/customer-campaigns/hook';
import Image from "next/image";
import DOMPurify from 'dompurify';
import { Badge } from "@/components/ui/badge";
import { Calendar, Info, CheckCircle, Users, Gift } from "lucide-react";
import PublicRewardCard from '@/components/rewards/PublicRewardCard';

export default function CampaignDetail() {
  const router = useRouter();
  const pathname = usePathname();
  const campaign = useSelector((state: RootState) => state.campaing);
  const [campaignId, setCampaignId] = useState<string>('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('campaignId');
    if (id) setCampaignId(id);

    // Proactive Login Check
    const token = getCookieValue('customerToken');
    if (!token) {
      router.push(`/campaign/login?redirect=${pathname}`);
    } else {
      setIsCheckingAuth(false);
    }
  }, [router, pathname]);

  const { data: joinStatus, isLoading: isJoinStatusLoading, error } = useCheckCampaignJoinStatus(campaignId);
  const { mutate: joinCampaignMutation, isPending: isJoining } = useJoinCampaign();

  useEffect(() => {
    if (error) {
      const axiosError = error as any;
      if (axiosError.response?.status === 401) {
        router.push(`/campaign/login?redirect=${pathname}`);
      }
    }
  }, [error, router, pathname]);
  
  const isMember = !!joinStatus?.isJoined;

  const handleJoinClick = () => {
    if (!campaignId) return;
    joinCampaignMutation(campaignId, {
      onSuccess: () => {
        // Handle success
      },
      onError: (error: any) => {
        console.error('Failed to join campaign:', error);
        alert('Failed to join campaign. Please try again.');
      }
    });
  };

  if (isCheckingAuth) {
      return <LoadingSpinner />;
  }

  if (!campaign.name && !campaignId) {
    return <LoadingSpinner />;
  }

  // Fallback image if bannerUrl is missing
  const bannerImage = campaign.bannerUrl || campaign.headerImg || 'https://placehold.co/1920x600?text=Campaign+Banner';
  const logoImage = campaign.logoUrl;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden group">
        <Image
          src={bannerImage}
          alt={campaign.name || 'Campaign Banner'}
          layout="fill"
          objectFit="cover"
          className="brightness-50 transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end pb-16 px-6 md:px-16">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-end md:items-center gap-8">
            {/* Logo Overlay */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-2xl shrink-0 bg-white">
              {logoImage ? (
                <Image
                  src={logoImage}
                  alt="Campaign Logo"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <span className="text-xs font-bold uppercase">No Logo</span>
                </div>
              )}
            </div>

            <div className="flex-1 text-white">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge className="bg-[#2D3DFF] hover:bg-blue-700 text-white border-none px-3 py-1 text-sm uppercase tracking-wide">
                  {campaign.type || 'Campaign'}
                </Badge>
                {campaign.audienceType && (
                  <Badge variant="secondary" className="px-3 py-1 text-sm uppercase tracking-wide bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-sm">
                    {campaign.audienceType}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 drop-shadow-xl">
                {campaign.name}
              </h1>
              <div
                className="text-lg md:text-xl text-gray-200 max-w-2xl line-clamp-2 drop-shadow-md"
                dangerouslySetInnerHTML={{
                  __html: typeof window !== 'undefined'
                    ? DOMPurify.sanitize(campaign.campaignMessage || campaign.homeText || 'Join this exclusive campaign to earn rewards!')
                    : (campaign.campaignMessage || campaign.homeText || 'Join this exclusive campaign to earn rewards!')
                }}
              />
            </div>

            {/* Desktop Action Button (Hero) */}
            {!isMember ? (
              <div className="hidden md:block shrink-0">
                <Button
                  onClick={handleJoinClick}
                  disabled={isJoining}
                  className="bg-[#2D3DFF] hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-white/20 font-bold"
                >
                  {isJoining ? 'Joining...' : 'Join Campaign'}
                </Button>
              </div>
            ) : (
              <div className="hidden md:block shrink-0">
                <Link href="#rewards">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-white/20 font-bold"
                  >
                    View Rewards
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 space-y-12">

        {/* Member Status Banner */}
        {isMember && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-lg flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-3 bg-green-100 rounded-full text-green-600 shrink-0">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-800">You are a member!</h3>
              <p className="text-green-700">Welcome! You can now earn points and redeem rewards in this campaign.</p>
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white shadow-lg border-none hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full text-[#2D3DFF]">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Start Date</p>
                <p className="text-sm font-semibold text-gray-900">{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'TBA'}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-none hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full text-[#2D3DFF]">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">End Date</p>
                <p className="text-sm font-semibold text-gray-900">{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'Ongoing'}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-none hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Audience</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">{campaign.audienceType || 'Public'}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-none hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Points to Join</p>
                <p className="text-sm font-semibold text-gray-900">
                  {campaign.signupPoints || 0} Points
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-16">
          {/* Main Content Column - Text Sections */}
          <div className="max-w-4xl space-y-12">
            {/* About Section */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Info className="w-8 h-8 text-[#2D3DFF]" />
                About This Campaign
              </h2>
              <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(campaign.campaignMessage || campaign.homeText || '') }} />
              </div>
            </section>
          </div>

          {/* Rewards Grid Section */}
          <div id="rewards" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Gift className="w-8 h-8 text-[#2D3DFF]" />
                  Rewards
                </h2>
                <p className="text-gray-500 mt-2">
                  Earn points and redeem these exclusive rewards.
                </p>
              </div>
              <Badge variant="outline" className="w-fit px-4 py-2 text-base font-medium">
                {campaign.rewards?.length || 0} Available
              </Badge>
            </div>

            {campaign.rewards && campaign.rewards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaign.rewards.map((reward, index) => (
                  <PublicRewardCard
                    key={index}
                    reward={reward as any}
                    isMember={isMember}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900">No rewards listed yet</h3>
                <p className="text-gray-500">Check back later for exciting rewards!</p>
              </div>
            )}
          </div>
        </div>
      </div >

      {/* Sticky Mobile/Bottom Action Bar */}
      < div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50 md:hidden" >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {!isMember ? (
            <Button
              onClick={handleJoinClick}
              disabled={isJoining}
              className="w-full bg-[#2D3DFF] hover:bg-blue-700 text-white text-lg py-6 rounded-xl shadow-lg font-bold"
            >
              {isJoining ? 'Joining...' : 'Join Campaign'}
            </Button>
          ) : (
            <div className="flex gap-2 w-full">
              <Link href={`/campaign/my-points`} className="flex-1">
                <Button variant="outline" className="w-full border-blue-200 text-[#2D3DFF] hover:bg-blue-50 font-bold">
                  My Points
                </Button>
              </Link>
              <Link href="#rewards" className="flex-1">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg font-bold">
                  Claim Reward
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div >
    </div >
  );
}