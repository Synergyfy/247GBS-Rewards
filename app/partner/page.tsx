'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Handshake,
    TrendingUp,
    ShieldCheck,
    Globe,
    Zap,
    BarChart3,
    Users,
    ArrowRight,
    CheckCircle2,
    Star,
    Building2,
    Briefcase
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

// --- Sub-components ---

const BenefitCard = ({ icon: Icon, title, description, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:scale-[1.02] transition-all group"
    >
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{description}</p>
    </motion.div>
);

const TierCard = ({ tier, price, description, features, popular, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col h-full ${popular
            ? 'bg-slate-900 border-slate-800 shadow-2xl scale-105 z-10 text-white'
            : 'bg-white border-slate-100 shadow-xl text-slate-900 hover:border-blue-100'
            }`}
    >
        {popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                Most Popular
            </div>
        )}

        <div className="mb-8">
            <h3 className={`text-2xl font-black mb-2 ${popular ? 'text-white' : 'text-slate-900'}`}>{tier}</h3>
            <p className={`${popular ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
        </div>

        <div className="flex items-baseline gap-1 mb-8">
            <span className="text-4xl font-black">{price}</span>
            <span className={`text-sm font-bold ${popular ? 'text-slate-400' : 'text-slate-400'}`}>/month</span>
        </div>

        <div className="space-y-4 mb-10 flex-grow">
            {features.map((feature: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 pt-0.5 ${popular ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`text-sm font-medium ${popular ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                </div>
            ))}
        </div>

        <button className={`w-full py-4 rounded-2xl font-bold transition-all ${popular
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
            : 'bg-slate-900 hover:bg-black text-white'
            }`}>
            {tier === 'Custom' ? 'Contact Sales' : 'Join Program'}
        </button>
    </motion.div>
);

export default function PartnerPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* --- Hero Section --- */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-white">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-100 rounded-full blur-[160px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[140px] -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8 backdrop-blur-md">
                                <Handshake className="w-4 h-4 text-blue-600" />
                                <span className="text-blue-700 font-black text-xs uppercase tracking-[0.2em]">Strategic Partnerships</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-[0.95]">
                                Scale your reach with <span className="text-blue-700">our network.</span>
                            </h1>

                            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                                Join the 247GBS ecosystem. Connect with thousands of customers, leverage cross-brand loyalty, and unlock unprecedented growth.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/signup">
                                    <button className="w-full sm:w-auto px-10 py-5 rounded-2xl font-black bg-blue-600 text-white shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all text-lg flex items-center justify-center gap-3">
                                        Become a Partner <Zap className="w-5 h-5 fill-white" />
                                    </button>
                                </Link>
                                <button className="w-full sm:w-auto px-10 py-5 rounded-2xl font-black bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all text-lg shadow-sm">
                                    Download Brochure
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- Benefits Section --- */}
            <section className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-20">
                        <div className="max-w-2xl">
                            <h2 className="text-lg font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Why Partner With Us</h2>
                            <h3 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                Transform your business through <br className="hidden md:block" />
                                <span className="text-slate-400">connectivity and collaboration.</span>
                            </h3>
                        </div>
                        <p className="text-slate-500 text-lg max-w-sm mb-2">
                            We don't just provide a platform; we build a community that drives value for everyone.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <BenefitCard
                            icon={TrendingUp}
                            title="Accelerated Growth"
                            description="Access a massive pool of ready-to-spend loyalty customers already active in the GBS network."
                            delay={0.1}
                        />
                        <BenefitCard
                            icon={Globe}
                            title="Cross-Brand Visibility"
                            description="Your brand showcased to users through our intelligent recommendation engine and shared reward pools."
                            delay={0.2}
                        />
                        <BenefitCard
                            icon={BarChart3}
                            title="Deep Analytics"
                            description="Get insights into customer behavior across the entire network, not just within your own shop."
                            delay={0.3}
                        />
                        <BenefitCard
                            icon={ShieldCheck}
                            title="Secure & Seamless"
                            description="Enterprise-grade security and instant settlement of point exchanges between partnering brands."
                            delay={0.4}
                        />
                        <BenefitCard
                            icon={Users}
                            title="Shared Ecosystem"
                            description="Collaborate with other brands for epic co-branded campaigns that amplify marketing budgets."
                            delay={0.5}
                        />
                        <BenefitCard
                            icon={Building2}
                            title="Managed Solutions"
                            description="Focus on your business while we handle the complex loyalty logic, API integrations, and support."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* --- Partnership Tiers --- */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-50" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">Flexible Partnership Tiers</h2>
                        <p className="text-lg text-slate-600 font-medium">Choose the level of integration that fits your business goals.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
                        <TierCard
                            tier="Starter"
                            price="$99"
                            description="Perfect for local businesses starting their loyalty journey."
                            features={[
                                "Access to Network Customer base",
                                "Basic Loyalty Points System",
                                "Merchant Dashboard Access",
                                "Email Support",
                                "Standard Commission Rates"
                            ]}
                            delay={0.1}
                        />
                        <TierCard
                            tier="Pro Network"
                            price="$299"
                            popular={true}
                            description="Ideal for growing brands looking for deep integration."
                            features={[
                                "Everything in Starter",
                                "Cross-Brand Reward Redemptions",
                                "Advanced Customer Analytics",
                                "Priority Ranking in App",
                                "Reduced Commission Rates",
                                "Dedicated Account Manager"
                            ]}
                            delay={0.2}
                        />
                        <TierCard
                            tier="Custom"
                            price="Contact"
                            description="For enterprises, malls, and multi-location franchises."
                            features={[
                                "White-label Loyalty App",
                                "Custom API Integrations",
                                "Omni-channel Support",
                                "Market exclusivity options",
                                "Strategic Marketing Support",
                                "SLA Guarantees"
                            ]}
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* --- Co-Branded Section --- */}
            <section className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-blue-600 rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative shadow-2xl shadow-blue-500/30">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-[80px]" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-black uppercase tracking-widest text-blue-100 italic">Spotlight Feature</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[0.95] tracking-tight">
                                    Launch massive <br className="hidden md:block" />
                                    Co-branded CAMPAIGNS.
                                </h2>
                                <p className="text-xl text-blue-100 mb-10 leading-relaxed font-medium">
                                    Leverage the power of the 247GBS network to launch joint promotions with other top brands. Split the costs, double the reach.
                                </p>
                                <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-50 transition-all shadow-xl">
                                    Learn More <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`h-40 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 flex flex-col justify-between ${i % 2 !== 0 ? 'translate-y-6' : ''}`}>
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-bold opacity-60 uppercase">Business {i}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA Section --- */}
            <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Ready to expand your horizon?</h2>
                    <p className="text-lg text-slate-500 mb-10 font-medium">Join our growing ecosystem and start reaching more customers today.</p>
                    <Link href="/signup">
                        <button className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-2xl hover:scale-105 active:scale-95">
                            Apply for Partnership
                        </button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
