'use client';

import React, { use } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, TrendingUp, Users, Sparkles, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

// --- Data Configuration ---

const seasonData: Record<string, {
    title: string;
    icon: string;
    gradient: string;
    accent: string;
    description: string;
    longDescription: string;
    duration: string;
    stats: { label: string; value: string }[];
    campaigns: { title: string; type: string; impact: string; description: string }[];
}> = {
    summer: {
        title: 'Summer Season',
        icon: '☀️',
        gradient: 'from-orange-400 to-yellow-400',
        accent: 'text-orange-600',
        description: 'Capitalize on the heat with refreshing rewards and high-energy campaigns.',
        longDescription: 'Summer is the peak time for outdoor activities, tourism, and social gatherings. Leverage the 247GBS platform to drive foot traffic with weather-triggered promotions, "Cool Down" rewards, and exclusive holiday deals. Our system helps you capture the influx of new customers and turn transient tourists into loyal patrons.',
        duration: 'June 21 – September 22',
        stats: [
            { label: 'Avg. Traffic Increase', value: '+34%' },
            { label: 'Tourist Engagement', value: 'High' },
            { label: 'Best for', value: 'Events' }
        ],
        campaigns: [
            {
                title: 'Heatwave Happy Hour',
                type: 'Flash Sale',
                impact: '+45% Sales',
                description: 'Automatically trigger 20% off cold drinks when temperatures hit 30°C.'
            },
            {
                title: 'Summer Solstice Points',
                type: 'Loyalty Boost',
                impact: '2x Retention',
                description: 'Double points on the longest day of the year to drive record attendance.'
            },
            {
                title: 'Holiday Haul',
                type: 'Referral',
                impact: '+150 New Users',
                description: 'Refer a friend for a summer trip voucher and get 500 bonus points.'
            }
        ]
    },
    autumn: {
        title: 'Autumn Season',
        icon: '🍂',
        gradient: 'from-amber-600 to-orange-500',
        accent: 'text-amber-700',
        description: 'Transition into the cozy season with warm offers and back-to-school boosts.',
        longDescription: 'As the leaves turn, consumer behavior shifts towards coziness and preparation. This is the perfect time to utilize 247GBS for "Back to School" campaigns and Halloween specials. Focus on comfort-based value propositions and re-engaging customers who may have drifted during the summer holidays.',
        duration: 'September 23 – December 20',
        stats: [
            { label: 'Avg. Ticket Size', value: '£45' },
            { label: 'Loyalty Signups', value: '+12%' },
            { label: 'Best for', value: 'Retail' }
        ],
        campaigns: [
            {
                title: 'Back to School Bundle',
                type: 'Product Bundle',
                impact: '+25% AOV',
                description: 'Buy 3 items, get the 4th free. Perfect for students and parents prepping for the new term.'
            },
            {
                title: 'Spooky Savings',
                type: 'Holiday Event',
                impact: 'High Engagement',
                description: 'Mystery discount vouchers revealed only when scanned in-store on Halloween.'
            },
            {
                title: 'Cozy Coffee Pass',
                type: 'Subscription',
                impact: 'Daily Visits',
                description: 'Unlock unlimited pumpkin spice lattes for a fixed monthly price.'
            }
        ]
    },
    winter: {
        title: 'Winter Season',
        icon: '❄️',
        gradient: 'from-blue-400 to-cyan-300',
        accent: 'text-blue-600',
        description: 'Maximize holiday spending with festive campaigns and end-of-year sales.',
        longDescription: 'The biggest spending season of the year. 247GBS empowers you to run festive advent calendars, Black Friday blowouts, and New Year resolutions campaigns. It’s crucial to build momentum before December and use post-holiday sales to clear inventory and maintain engagement into January.',
        duration: 'December 21 – March 19',
        stats: [
            { label: 'Revenue Peak', value: 'December' },
            { label: 'Gift Card Sales', value: '+200%' },
            { label: 'Best for', value: 'Gifting' }
        ],
        campaigns: [
            {
                title: '12 Days of Giving',
                type: 'Daily Rewards',
                impact: 'Daily App Opens',
                description: 'A digital advent calendar in the app revealing a new small reward every day.'
            },
            {
                title: 'Black Friday VIP',
                type: 'Exclusive Access',
                impact: '+60% Revenue',
                description: 'Early access to sales for Gold Tier loyalty members.'
            },
            {
                title: 'New Year, New You',
                type: 'Challenge',
                impact: 'Jan Retention',
                description: 'Complete 5 visits in January to earn a massive bonus reward.'
            }
        ]
    },
    spring: {
        title: 'Spring Season',
        icon: '🌸',
        gradient: 'from-pink-400 to-rose-400',
        accent: 'text-pink-600',
        description: 'Refresh your business strategy with blooming offers and new beginnings.',
        longDescription: 'Spring represents renewal. Use this time to launch new products, clear out old inventory (Spring Cleaning sales), and engage customers with Easter egg hunts. 247GBS helps you re-activate dormant users who hibernate during winter with fresh, vibrant campaigns.',
        duration: 'March 20 – June 20',
        stats: [
            { label: 'Footfall Growth', value: '+18%' },
            { label: 'New Product Launch', value: 'Ideal' },
            { label: 'Best for', value: 'Fashion' }
        ],
        campaigns: [
            {
                title: 'Easter Egg Hunt',
                type: 'Gamification',
                impact: 'High Viral Fun',
                description: 'Hide digital "eggs" (QR codes) around your store/site for customers to find and scan.'
            },
            {
                title: 'Spring Cleaning Sale',
                type: 'Clearance',
                impact: 'Inventory Clear',
                description: 'Aggressive discounts on last season’s stock to make room for new arrivals.'
            },
            {
                title: 'Mother’s Day Special',
                type: 'Gifting',
                impact: '+30% Gift Sales',
                description: 'Double loyalty points on all gift card purchases for Mom.'
            }
        ]
    }
};

// --- Components ---

const CampaignCard = ({ campaign, index }: { campaign: any, index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-transform"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-50 px-3 py-1 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">
                {campaign.type}
            </div>
            <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                <TrendingUp className="w-4 h-4" />
                {campaign.impact}
            </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{campaign.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
            {campaign.description}
        </p>
        <button className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-black transition-colors flex items-center justify-center gap-2 group">
            Use Template <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
    </motion.div>
);

const StatCard = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl">
        <div className="text-white/70 text-sm font-medium mb-1">{label}</div>
        <div className="text-white text-2xl font-bold">{value}</div>
    </div>
);

// --- Page Component ---

export default function SeasonPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const season = seasonData[slug?.toLowerCase()];

    if (!season) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 overflow-hidden">
                {/* Abstract Backgrounds */}
                <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br ${season.gradient} rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 -z-10`} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-8 font-medium">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm mb-6">
                                <Calendar className={`w-4 h-4 ${season.accent}`} />
                                <span className="text-slate-600 font-bold text-sm">{season.duration}</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 leading-tight">
                                {season.title} <span className="block text-4xl mt-2 opacity-50">{season.icon}</span>
                            </h1>

                            <p className="text-xl text-slate-600 mb-8 leading-relaxed font-medium">
                                {season.description}
                            </p>

                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                    <Sparkles className={`w-5 h-5 ${season.accent}`} />
                                    Why leverage this season?
                                </h3>
                                <p className="text-slate-500 leading-relaxed">
                                    {season.longDescription}
                                </p>
                            </div>
                        </motion.div>

                        {/* Interactive Card / Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className={`relative aspect-square rounded-[3rem] bg-gradient-to-br ${season.gradient} p-8 flex flex-col justify-between shadow-2xl`}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {season.stats.map((stat, i) => (
                                    <StatCard key={i} {...stat} />
                                ))}
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 mt-auto">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl">
                                        {season.icon}
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-lg">Season Active</div>
                                        <div className="text-white/70 text-sm">Campaigns Ready</div>
                                    </div>
                                </div>
                                <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '70%' }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className="h-full bg-white"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Campaigns Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                            Recommended Campaigns
                        </h2>
                        <p className="text-lg text-slate-500">
                            Proven strategies to maximize your revenue during {season.title}.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {season.campaigns.map((campaign, idx) => (
                            <CampaignCard key={idx} campaign={campaign} index={idx} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
