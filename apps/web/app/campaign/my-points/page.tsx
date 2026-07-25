'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from 'next/navigation';
import { useGetParticipantBalance, useCheckCampaignJoinStatus, useGetParticipantHistory } from '@/services/hooks/customer-campaigns/hook';
import LoadingSpinner from '@/components/ui/Loading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCookieValue } from '@/services/getCookieValue';
import { Trophy, History, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function MyPointsPage() {
  const [campaignId, setCampaignId] = useState<string>('');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem('campaignId');
    if (id) setCampaignId(id);
  }, []);

  const { data: joinStatus, isLoading: isStatusLoading } = useCheckCampaignJoinStatus(campaignId);
  const { data: balance } = useGetParticipantBalance(campaignId);
  const { data: historyData } = useGetParticipantHistory(campaignId);

  const isMember = !!joinStatus?.isJoined;
  const isAuthenticated = !!getCookieValue('customerToken');

  const pointBalance = balance?.balance || 0;

  useEffect(() => {
    if (!isStatusLoading && !isMember) {
      setIsAuthDialogOpen(true);
    }
  }, [isMember, isStatusLoading]);

  const handleLogin = () => {
    router.push(`/campaign/login`);
  };

  const handleSignUp = () => {
    router.push(`/campaign/signup`);
  };

  const handleDialogClose = (open: boolean) => {
    setIsAuthDialogOpen(open);
    if (!open && !isMember) {
      router.push(`/campaign`);
    }
  };

  if (isStatusLoading) {
    return <LoadingSpinner />;
  }

  if (!isMember) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-xl">
          <div className="w-20 h-20 bg-blue-50 text-[#2D3DFF] rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join to See Your Points</h2>
          <p className="text-lg text-gray-600 mb-8">
            Please join this campaign to view your points balance and transaction history.
          </p>
          <div className="flex flex-col gap-4">
            <Button onClick={() => router.push('/campaign')} className="w-full py-6 text-lg bg-[#2D3DFF] hover:bg-blue-700 font-bold rounded-xl">
              Go to Campaign Page
            </Button>
          </div>
        </div>

        <Dialog open={isAuthDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Points & History</DialogTitle>
              <DialogDescription className="text-base text-gray-500">
                You need to be a member of this campaign to see your balance and activity.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              {!isAuthenticated ? (
                <>
                  <Button onClick={handleLogin} className="w-full py-6 text-lg bg-[#2D3DFF] hover:bg-blue-700 font-bold rounded-xl">
                    Log In / Sign Up
                  </Button>
                </>
              ) : (
                <Button onClick={() => router.push('/campaign')} className="w-full py-6 text-lg bg-[#2D3DFF] hover:bg-blue-700 font-bold rounded-xl">
                  Join Campaign
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Activity Hub</h1>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#2D3DFF]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Pts</p>
              <p className="text-xl font-bold text-gray-900">{pointBalance}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="balance" className="w-full space-y-6">
          <TabsList className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm w-fit">
            <TabsTrigger value="balance" className="rounded-xl px-8 py-3 data-[state=active]:bg-[#2D3DFF] data-[state=active]:text-white font-bold transition-all">
              <Trophy className="w-4 h-4 mr-2" /> Balance
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl px-8 py-3 data-[state=active]:bg-[#2D3DFF] data-[state=active]:text-white font-bold transition-all">
              <History className="w-4 h-4 mr-2" /> History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="balance" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-white border-none shadow-xl rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-[#2D3DFF] p-12 text-center text-white relative">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
                  <Trophy className="w-64 h-64 -ml-20 -mt-20 absolute" />
                </div>
                <h2 className="text-xl font-bold opacity-80 mb-4 uppercase tracking-widest">Main Balance</h2>
                <p className="text-8xl font-black mb-2">{pointBalance}</p>
                <p className="text-2xl font-medium opacity-90">Loyalty Points</p>
              </div>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gray-50 rounded-2xl space-y-2">
                    <p className="text-sm font-bold text-gray-400 uppercase">Status</p>
                    <p className="text-lg font-bold text-green-600 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Active Member
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-2xl space-y-2">
                    <p className="text-sm font-bold text-gray-400 uppercase">Recent Activity</p>
                    <p className="text-lg font-bold text-gray-900">{historyData?.total || 0} Transactions</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-2xl space-y-2">
                    <p className="text-sm font-bold text-gray-400 uppercase">Next Tier</p>
                    <p className="text-lg font-bold text-blue-600">Premium member</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-white border-none shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="p-8 border-b border-gray-50">
                <CardTitle className="text-2xl">Transaction History</CardTitle>
                <CardDescription>
                  Keep track of every point earned and spent in this campaign.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow>
                      <TableHead className="px-8 font-bold">Action</TableHead>
                      <TableHead className="font-bold">Details</TableHead>
                      <TableHead className="text-right font-bold">Points</TableHead>
                      <TableHead className="text-right px-8 font-bold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyData?.data?.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="px-8 font-semibold">
                          <div className="flex items-center gap-3">
                            {transaction.type === 'EARN' ? (
                              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                <ArrowUpRight className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                <ArrowDownLeft className="w-4 h-4" />
                              </div>
                            )}
                            {transaction.type === 'EARN' ? 'Earned' : 'Redeemed'}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {transaction.description || (transaction.type === 'EARN' ? 'Points Awarded' : transaction.reward?.title || 'Reward Claimed')}
                        </TableCell>
                        <TableCell className={`text-right font-black ${transaction.type === 'EARN' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'EARN' ? '+' : '-'}{transaction.points}
                        </TableCell>
                        <TableCell className="text-right px-8 text-gray-500 font-medium">
                          {new Date(transaction.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!historyData?.data || historyData.data.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-20 text-gray-400">
                          <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          <p className="text-lg font-medium">No activity found yet</p>
                          <p className="text-sm">Start earning points to see them here!</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
