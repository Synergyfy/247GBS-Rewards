'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import {
    Users,
    Coins,
    Gift,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Calendar
} from 'lucide-react';
import { useGetCampaignAnalytics } from '@/services/hooks/analytics/hook';
import { Bars } from 'react-loader-spinner';

interface CampaignAnalyticsProps {
    campaignId: string;
}

const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({ campaignId }) => {
    const { data: analytics, isLoading, error } = useGetCampaignAnalytics(campaignId);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Bars height="50" width="50" color="#2D3DFF" ariaLabel="loading" />
                <p className="mt-4 text-gray-500 animate-pulse">Gathering campaign insights...</p>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 font-medium">Failed to load analytics data.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    const combinedData = analytics.pointsActivity.map((item, index) => ({
        date: item.date,
        points: item.count,
        rewards: analytics.rewardsActivity[index]?.count || 0,
    }));

    const stats = [
        {
            label: 'Total Customers',
            value: analytics.totalCustomers,
            icon: Users,
            color: 'blue',
            trend: '+12%',
            isUp: true,
        },
        {
            label: 'Points Issued',
            value: analytics.totalPointsIssued,
            icon: Coins,
            color: 'amber',
            trend: '+5.4%',
            isUp: true,
        },
        {
            label: 'Rewards Redeemed',
            value: analytics.totalRewardsRedeemed,
            icon: Gift,
            color: 'emerald',
            trend: '-2.1%',
            isUp: false,
        },
    ];

    return (
        <div className="space-y-8 p-1">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{analytics.campaignName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${analytics.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="text-sm text-gray-500 font-medium">
                            {analytics.isActive ? 'Live & Active' : 'Currently Inactive'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button className="px-4 py-1.5 text-xs font-semibold bg-white rounded-md shadow-sm text-gray-900 border border-gray-200">
                        Last 7 Days
                    </button>
                    <button className="px-4 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700">
                        30 Days
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                                <stat.icon size={24} className={`text-${stat.color}-600`} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? 'text-green-600' : 'text-red-500'}`}>
                                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.trend}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            <h4 className="text-3xl font-black text-gray-900 mt-1">{stat.value.toLocaleString()}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* main chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h4 className="text-lg font-bold text-gray-900">Activity Overview</h4>
                        <p className="text-sm text-gray-500">Comparing points issued vs rewards redeemed</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                            <span>Points</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                            <span>Rewards</span>
                        </div>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={combinedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2D3DFF" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#2D3DFF" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorRewards" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                cursor={{ stroke: '#f0f0f0', strokeWidth: 2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="points"
                                stroke="#2D3DFF"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorPoints)"
                                animationDuration={1500}
                            />
                            <Area
                                type="monotone"
                                dataKey="rewards"
                                stroke="#10B981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRewards)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Activity Table Placeholder / More Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 italic text-gray-500 flex items-center justify-center text-sm">
                    <Activity size={16} className="mr-2" />
                    More detailed breakdown coming soon...
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 italic text-gray-500 flex items-center justify-center text-sm">
                    <Calendar size={16} className="mr-2" />
                    Scheduled reports available in Pro plan
                </div>
            </div>
        </div>
    );
};

export default CampaignAnalytics;
