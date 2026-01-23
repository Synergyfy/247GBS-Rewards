'use client';

import React from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
} from 'recharts';
import {
    Gift,
    TrendingUp,
    Users,
    Zap,
    ArrowUpRight,
    Target,
    Clock
} from 'lucide-react';

interface RewardAnalyticsProps {
    rewardId: string;
}

const RewardAnalytics: React.FC<RewardAnalyticsProps> = ({ rewardId }) => {
    // Mock data since endpoint is not ready
    const mockData = {
        rewardName: "Free Coffee Upgrade",
        totalRedemptions: 142,
        activeUsers: 89,
        conversionRate: "24.5%",
        redemptionActivity: [
            { day: 'Mon', count: 12 },
            { day: 'Tue', count: 18 },
            { day: 'Wed', count: 15 },
            { day: 'Thu', count: 22 },
            { day: 'Fri', count: 35 },
            { day: 'Sat', count: 28 },
            { day: 'Sun', count: 12 },
        ],
    };

    const stats = [
        {
            label: 'Total Redemptions',
            value: mockData.totalRedemptions,
            icon: Gift,
            color: 'blue',
            trend: '+15%',
        },
        {
            label: 'Unique Users',
            value: mockData.activeUsers,
            icon: Users,
            color: 'purple',
            trend: '+8%',
        },
        {
            label: 'Conversion Rate',
            value: mockData.conversionRate,
            icon: Zap,
            color: 'orange',
            trend: '+3.2%',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{mockData.rewardName}</h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Clock size={14} /> Analytics for the last 7 days (Mock Data)
                    </p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1">
                    <TrendingUp size={14} /> High Performance
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                                <ArrowUpRight size={14} />
                                {stat.trend}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <h4 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h4 className="text-lg font-bold text-gray-900">Daily Redemptions</h4>
                        <p className="text-sm text-gray-500">How many times this reward was claimed today</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <Target className="text-gray-400" size={20} />
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockData.redemptionActivity}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Bar
                                dataKey="count"
                                radius={[6, 6, 0, 0]}
                                animationDuration={1500}
                            >
                                {mockData.redemptionActivity.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === 4 ? '#2D3DFF' : '#94a3b8'}
                                        fillOpacity={index === 4 ? 1 : 0.2}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Insight Section */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white overflow-hidden relative">
                <div className="relative z-10">
                    <h4 className="font-bold text-lg mb-2">Smart Insight 💡</h4>
                    <p className="text-blue-100 text-sm leading-relaxed max-w-md">
                        Your reward is peak in popularity on **Fridays**. Consider offering a limited-time "Friday Flash" bonus to drive even more engagement!
                    </p>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                    <Zap size={140} />
                </div>
            </div>
        </div>
    );
};

export default RewardAnalytics;
