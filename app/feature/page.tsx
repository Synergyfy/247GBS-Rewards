'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

// Feature data with solid colors for better contrast
const features = [
    {
        id: 'audit',
        icon: BarChart3,
        title: 'Business Audit & Growth Engine',
        subtitle: 'We understand your business before we grow it.',
        description: 'Get a full business audit that reveals opportunities you never knew existed.',
        points: [
            'What is selling vs. not selling',
            'Overstocked & expiring inventory',
            'Idle staff and machines',
            'Hidden profit opportunities'
        ],
        iconBg: 'bg-blue-600',
        iconColor: 'text-blue-600',
        cardBg: 'bg-blue-50',
    },
    {
        id: 'rewards',
        icon: Gift,
        title: 'Rewards, Cashback & Loyalty',
        subtitle: 'Earn rewards every time you use 247GBS.',
        description: 'All rewards go into your V-Card wallet, usable across our ecosystem.',
        points: [
            'Cashback on every transaction',
            'Loyalty points accumulation',
            'Free products and services',
            'Exclusive vouchers'
        ],
        iconBg: 'bg-blue-600',
        iconColor: 'text-blue-600',
        cardBg: 'bg-blue-50',
    },
    {
        id: 'marketing',
        icon: Megaphone,
        title: 'Customer Growth & Marketing Tools',
        subtitle: 'Bring customers back automatically.',
        description: 'Powerful marketing tools to get new customers and increase spend.',
        points: [
            'QR code campaigns',
            'Loyalty cards & coupons',
            'Local & national promotions',
            'Cashback offers'
        ],
        iconBg: 'bg-green-600',
        iconColor: 'text-green-600',
        cardBg: 'bg-green-50',
    },
    {
        id: 'software',
        icon: Laptop,
        title: 'Business Software Included',
        subtitle: 'Over 80 business tools in one platform.',
        description: 'No need to buy tools from different companies. Everything is included.',
        points: [
            'CRM & sales tracking',
            'Campaign builder',
            'AI assistants',
            'Reports & analytics'
        ],
        iconBg: 'bg-purple-600',
        iconColor: 'text-purple-600',
        cardBg: 'bg-purple-50',
    },
    {
        id: 'machines',
        icon: CreditCard,
        title: 'Machines & In-Store Tools',
        subtitle: 'Hardware to run your shop.',
        description: 'Physical tools that connect directly to your rewards and loyalty system.',
        points: [
            'Payment terminals',
            'QR code displays',
            'Loyalty scanners',
            'Smart tills'
        ],
        iconBg: 'bg-slate-700',
        iconColor: 'text-slate-700',
        cardBg: 'bg-slate-100',
    },
    {
        id: 'support',
        icon: HeadphonesIcon,
        title: 'People & Support',
        subtitle: 'You are never left alone.',
        description: 'A dedicated team to help you succeed at every step.',
        points: [
            'Account managers',
            'Business agents',
            'AI assistants',
            'Business consultants'
        ],
        iconBg: 'bg-pink-600',
        iconColor: 'text-pink-600',
        cardBg: 'bg-pink-50',
    },
    {
        id: 'group',
        icon: Network,
        title: 'Group & National Power',
        subtitle: 'Join forces with other businesses.',
        description: 'Small businesses get the power of big brands through collaboration.',
        points: [
            'Group buying power',
            'Shared marketing',
            'National campaigns',
            'Partner promotions'
        ],
        iconBg: 'bg-cyan-600',
        iconColor: 'text-cyan-600',
        cardBg: 'bg-cyan-50',
    },
];

// Feature Card Component with high contrast
const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
    const Icon = feature.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group"
        >
            <div className={`relative overflow-hidden rounded-3xl ${feature.cardBg} p-8 md:p-10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-slate-200/50`}>
                {/* Icon - solid background for visibility */}
                <div className={`w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content - high contrast text */}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className={`${feature.iconColor} font-semibold mb-4`}>
                    {feature.subtitle}
                </p>
                <p className="text-slate-700 mb-6 leading-relaxed">{feature.description}</p>

                {/* Points - solid colored icons */}
                <ul className="space-y-3">
                    {feature.points.map((point, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-800">
                            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${feature.iconColor}`} />
                            <span className="font-medium">{point}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

export default function FeaturePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-24 bg-white">
                {/* Background Decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-[80px]"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-900 font-bold text-sm">Everything You Get with 247GBS</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                            Grow Your Business with{' '}
                            <span className="text-blue-600">
                                One Complete System
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
                            Customers, rewards, cashback, marketing, software, and support — all in one platform.
                            247GBS is not just a tool. It&apos;s a full business growth engine.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/signup">
                                <button className="group px-8 py-4 bg-blue-600 text-white font-bold rounded-full shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-2">
                                    Join & Start Getting Rewards
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <Link href="#calculator">
                                <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                    See How Much I Could Earn
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                            Everything Your Business Needs
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                            From auditing to marketing, hardware to support — we&apos;ve got you covered.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard key={feature.id} feature={feature} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Different Section */}
            <section className="py-24 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                            Why 247GBS Is Different
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                            We don&apos;t sell tools. We give you everything to grow.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Users, label: 'Customers', desc: 'We bring them to you' },
                            { icon: BadgePercent, label: 'Money', desc: 'Cashback & rewards' },
                            { icon: Gift, label: 'Rewards', desc: 'Points & vouchers' },
                            { icon: Megaphone, label: 'Marketing', desc: 'Campaigns & tools' },
                            { icon: Laptop, label: 'Software', desc: '80+ business tools' },
                            { icon: HeadphonesIcon, label: 'Support', desc: 'Real people helping' },
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow flex items-center gap-4 border border-slate-100"
                            >
                                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg tracking-tight">{item.label}</h3>
                                    <p className="text-slate-600 text-sm font-medium">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight">
                            Start Earning Rewards & Growing Today
                        </h2>
                        <p className="text-xl text-slate-600 mb-10 font-medium leading-relaxed">
                            Join thousands of businesses already using 247GBS to grow.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/signup">
                                <button className="group px-8 py-4 bg-blue-600 text-white font-bold rounded-full shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-2">
                                    Join 247GBS & Start Getting Rewards
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <Link href="#calculator">
                                <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                                    See How Much I Could Earn
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
