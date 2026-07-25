'use client';

import React from 'react';
import {
    Gift,
    TrendingUp,
    Users,
    Zap,
    Clock,
    Loader2,
    AlertCircle,
    Coins
} from 'lucide-react';
import { useGetRewardStats } from '@/services/hooks/analytics/hook';

interface RewardAnalyticsProps {
    rewardId: string;
    rewardTitle?: string;
}

const RewardAnalytics: React.FC<RewardAnalyticsProps> = ({ rewardId, rewardTitle }) => {
    const { data: stats, isLoading, isError } = useGetRewardStats(rewardId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    if (isError || !stats) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <AlertCircle size={40} className="mb-4" />
                <p className="font-semibold">Failed to load reward stats</p>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Redemptions',
            value: stats.totalRedeemed.toLocaleString(),
            icon: Gift,
            color: 'blue',
        },
        {
            label: 'Unique Customers',
            value: stats.uniqueCustomers.toLocaleString(),
            icon: Users,
            color: 'purple',
        },
        {
            label: 'Conversion Rate',
            value: `${(stats.avgConversionRate * 100).toFixed(1)}%`,
            icon: Zap,
            color: 'orange',
        },
        {
            label: 'Total Points Spent',
            value: stats.totalPointsSpent.toLocaleString(),
            icon: Coins,
            color: 'green',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{rewardTitle || 'Reward Performance'}</h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Clock size={14} /> Real-time analytics overview
                    </p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1">
                    <TrendingUp size={14} /> Active
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <h4 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RewardAnalytics;
