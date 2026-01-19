'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Gift,
    Users,
    Laptop,
    CreditCard,
    HeadphonesIcon,
    Network,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    BarChart3,
    BadgePercent,
    Megaphone,
    Search,
    PieChart,
    Wallet
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

// --- Abstract Visual Components ---

const AuditVisual = () => (
    <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden p-6 flex flex-col">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
                <div className="h-2 w-24 bg-slate-200 rounded-full mb-2" />
                <div className="h-2 w-16 bg-slate-100 rounded-full" />
            </div>
        </div>
        <div className="flex-1 flex gap-4 items-end px-4">
            {[40, 70, 50, 90, 60, 80].map((h, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg opacity-90"
                />
            ))}
        </div>
        {/* Floating Bubble */}
        <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 right-8 bg-white p-4 rounded-2xl shadow-xl border border-orange-100 z-10"
        >
            <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs font-bold text-slate-600">Profit Found</span>
            </div>
            <div className="text-2xl font-black text-slate-900">+15%</div>
        </motion.div>
    </div>
);

const RewardsVisual = () => (
    <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl shadow-blue-900/20 overflow-hidden flex items-center justify-center p-8">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+')]" />

        <div className="relative w-64 h-40 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col justify-between transform -rotate-6 transition-transform hover:rotate-0 duration-500">
            <div className="flex justify-between items-start">
                <Wallet className="text-white w-8 h-8" />
                <div className="text-white/80 font-mono text-sm">V-CARD</div>
            </div>
            <div>
                <div className="text-white/60 text-xs mb-1">Total Balance</div>
                <div className="text-3xl font-bold text-white tracking-widest">2,450 <span className="text-sm font-normal text-blue-200">PTS</span></div>
            </div>
        </div>

        <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/4 right-1/4 w-16 h-16 bg-yellow-400 rounded-full blur-2xl opacity-60 pointer-events-none"
        />
    </div>
);

const MarketingVisual = () => (
    <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-slate-900 rounded-3xl shadow-2xl overflow-hidden p-8 flex items-center justify-center">
        <div className="absolute inset-0 bg-green-500/5" />

        <div className="relative z-10 w-full max-w-xs">
            <div className="bg-slate-800 rounded-xl p-4 mb-4 border border-slate-700 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Megaphone className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-sm font-bold text-white">Promo Sent!</div>
                </div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-green-500"
                    />
                </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-xl ml-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-sm font-bold text-white">Customers Reached</div>
                </div>
                <div className="flex items-end gap-2 text-2xl font-bold text-white">
                    1,204 <span className="text-xs text-green-400 mb-1">+24%</span>
                </div>
            </div>
        </div>

        {/* Radar Waves */}
        <motion.div
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-green-500/30 rounded-full"
        />
    </div>
);

const SoftwareVisual = () => (
    <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-slate-50 rounded-3xl border border-slate-200 p-8 grid grid-cols-2 gap-4 overflow-hidden">
        {[
            { c: 'bg-indigo-100', i: 'text-indigo-600' },
            { c: 'bg-pink-100', i: 'text-pink-600' },
            { c: 'bg-cyan-100', i: 'text-cyan-600' },
            { c: 'bg-amber-100', i: 'text-amber-600' },
        ].map((style, i) => (
            <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className={`${style.c} rounded-2xl flex items-center justify-center shadow-sm`}
            >
                <Laptop className={`w-8 h-8 ${style.i}`} />
            </motion.div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white px-6 py-3 rounded-full shadow-xl border border-indigo-100 font-bold text-slate-800 backdrop-blur-md">
                80+ Tools
            </div>
        </div>
    </div>
);

const MachinesVisual = () => (
    <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 flex items-center justify-center overflow-hidden">
        <div className="w-48 h-64 bg-slate-900 rounded-3xl p-4 shadow-2xl relative z-10">
            <div className="w-full h-32 bg-white rounded-xl mb-4 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-slate-900" />
            </div>
            <div className="space-y-2">
                <div className="h-2 w-16 bg-slate-700 rounded-full" />
                <div className="h-2 w-24 bg-slate-800 rounded-full" />
            </div>
            <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
        </div>

        {/* Connection Lines */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 -z-0" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-200 -z-0" />
    </div>
);

const SupportVisual = () => (
    <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-pink-50 rounded-3xl border border-pink-100 p-8 flex flex-col justify-center gap-4">
        <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-lg max-w-[80%]">
                <div className="h-2 w-32 bg-slate-100 rounded-full mb-2" />
                <div className="h-2 w-24 bg-slate-100 rounded-full" />
            </div>
        </div>
        <div className="flex justify-end">
            <div className="bg-pink-600 p-4 rounded-2xl rounded-tr-none shadow-lg max-w-[80%]">
                <div className="h-2 w-40 bg-pink-400 rounded-full mb-2" />
                <div className="h-2 w-20 bg-pink-400 rounded-full" />
            </div>
        </div>
        <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-lg max-w-[80%] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-bold text-slate-700">Problem Solved!</span>
            </div>
        </div>
    </div>
);


// --- Feature Data ---

const features = [
    {
        id: 'audit',
        icon: BarChart3,
        title: 'Business Audit & Growth Engine',
        subtitle: 'We understand your business before we grow it.',
        description: 'Get a full business audit that reveals opportunities you never knew existed. Understand what is selling, discover hidden profit opportunities, and optimize your inventory.',
        highlights: ['Sales Analysis', 'Stock Optimization', 'Staff Utilization'],
        color: 'text-orange-600',
        bg: 'bg-orange-600',
        lightBg: 'bg-orange-50',
        visual: AuditVisual
    },
    {
        id: 'rewards',
        icon: Gift,
        title: 'Rewards, Cashback & Loyalty',
        subtitle: 'Earn rewards every time you use 247GBS.',
        description: 'All rewards go into your V-Card wallet, usable across our entire ecosystem. Give your customers a reason to come back with cashback, points, and exclusive vouchers.',
        highlights: ['V-Card Wallet', 'Cashback', 'Loyalty Points'],
        color: 'text-blue-600',
        bg: 'bg-blue-600',
        lightBg: 'bg-blue-50',
        visual: RewardsVisual
    },
    {
        id: 'marketing',
        icon: Megaphone,
        title: 'Customer Growth & Marketing Tools',
        subtitle: 'Bring customers back automatically.',
        description: 'Powerful marketing tools to get new customers and increase spend. Launch QR campaigns, issue digital coupons, and run local promotions in minutes.',
        highlights: ['QR Campaigns', 'Vouchers', 'Local Promos'],
        color: 'text-green-600',
        bg: 'bg-green-600',
        lightBg: 'bg-green-50',
        visual: MarketingVisual
    },
    {
        id: 'software',
        icon: Laptop,
        title: 'Business Software Included',
        subtitle: 'Over 80 business tools in one platform.',
        description: 'No need to buy tools from different companies. Everything is included: CRM, Sales Tracking, Campaign Builder, AI Assistants, and more.',
        highlights: ['CRM', 'AI Assistants', 'Analytics'],
        color: 'text-indigo-600',
        bg: 'bg-indigo-600',
        lightBg: 'bg-indigo-50',
        visual: SoftwareVisual
    },
    {
        id: 'machines',
        icon: CreditCard,
        title: 'Machines & In-Store Tools',
        subtitle: 'Hardware to run your shop.',
        description: 'Physical tools that connect directly to your rewards and loyalty system. Smart tills, payment terminals, and QR displays that just work.',
        highlights: ['Payment Terminals', 'QR Displays', 'Smart Tills'],
        color: 'text-slate-700',
        bg: 'bg-slate-700',
        lightBg: 'bg-slate-100',
        visual: MachinesVisual
    },
    {
        id: 'support',
        icon: HeadphonesIcon,
        title: 'People & Support',
        subtitle: 'You are never left alone.',
        description: 'A dedicated team to help you succeed at every step. Access account managers, business agents, and 24/7 help desk support whenever you need it.',
        highlights: ['Account Managers', 'Help Desk', 'Consultants'],
        color: 'text-pink-600',
        bg: 'bg-pink-600',
        lightBg: 'bg-pink-50',
        visual: SupportVisual
    }
];

export default function FeaturePage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-slate-50/50 -z-10" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Hero Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-8">
                                <Sparkles className="w-4 h-4 text-blue-600" />
                                <span className="text-blue-900 font-bold text-sm tracking-wide">Everything You Get with 247GBS</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 leading-[1.1]">
                                One System. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    Endless Potential.
                                </span>
                            </h1>

                            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium max-w-lg">
                                Replacing 10+ different subscriptions with one power-packed growth engine.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/signup">
                                    <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                                        Join & Start Growing
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </Link>
                                <Link href="#calculator">
                                    <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all w-full sm:w-auto">
                                        View Pricing
                                    </button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Hero Visual - Super App Abstract */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative aspect-square bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-8 overflow-hidden z-10">
                                {/* Abstract Grid of Apps */}
                                <div className="grid grid-cols-2 gap-4 h-full">
                                    <div className="bg-slate-50 rounded-3xl p-6 flex flex-col justify-between">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                            <TrendingUp size={24} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-2 w-20 bg-slate-200 rounded-full" />
                                            <div className="h-2 w-12 bg-slate-200 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-orange-50 rounded-3xl p-6 h-1/2 flex items-center justify-center">
                                            <Gift className="w-8 h-8 text-orange-500" />
                                        </div>
                                        <div className="bg-green-50 rounded-3xl p-6 h-1/2 flex items-center justify-center">
                                            <Users className="w-8 h-8 text-green-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Central Hub Icon */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-600/30 flex items-center justify-center z-20">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                            </div>

                            {/* Decorative Blobs */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-50 -z-10" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-50 -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Zig-Zag Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
                    {features.map((feature, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.8 }}
                                className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${!isEven ? 'lg:flex-row-reverse' : ''}`}
                            >
                                {/* Text Content */}
                                <div className="flex-1 space-y-8">
                                    <div className={`w-16 h-16 rounded-2xl ${feature.lightBg} flex items-center justify-center`}>
                                        <feature.icon className={`w-8 h-8 ${feature.color}`} />
                                    </div>

                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                                            {feature.title}
                                        </h2>
                                        <p className="text-lg font-medium text-slate-500 mb-4">
                                            {feature.subtitle}
                                        </p>
                                        <p className="text-lg text-slate-600 leading-relaxed font-normal">
                                            {feature.description}
                                        </p>
                                    </div>

                                    <ul className="space-y-4">
                                        {feature.highlights.map((item, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <CheckCircle2 className={`w-6 h-6 ${feature.color}`} />
                                                <span className="text-lg font-bold text-slate-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Visual Content */}
                                <div className="flex-1 w-full">
                                    <feature.visual />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            <Footer />
        </div>
    );
}
