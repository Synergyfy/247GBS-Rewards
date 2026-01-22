'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    MessageCircle,
    Mail,
    Phone,
    Calendar,
    ChevronDown,
    ChevronRight,
    ArrowRight,
    LifeBuoy,
    FileText,
    Zap,
    Users
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

// --- Components ---

const ContactCard = ({ icon: Icon, title, description, action, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all group cursor-pointer"
    >
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 mb-8 leading-relaxed h-12">{description}</p>
        <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:gap-4 transition-all">
            {action} <ArrowRight className="w-4 h-4" />
        </div>
    </motion.div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-600'}`}>
                    {question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-blue-100 rotate-180' : 'bg-slate-50 group-hover:bg-blue-50'}`}>
                    <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-blue-600' : 'text-slate-500'}`} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-slate-600 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Page = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* --- Hero Section --- */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-8">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-blue-900 font-bold text-sm tracking-wide">Support Team Online</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tight">
                            How can we <span className="text-blue-700">help you?</span>
                        </h1>

                        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Find answers, contact our team, or manage your account. We're here 24/7 to ensure your business keeps growing.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                            <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-2 pl-6">
                                <Search className="w-6 h-6 text-slate-400 mr-4" />
                                <input
                                    type="text"
                                    placeholder="Ask a question (e.g., 'How to set up rewards?')"
                                    className="flex-1 text-lg font-medium text-slate-900 placeholder-slate-400 outline-none bg-transparent py-4"
                                />
                                <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-colors">
                                    Search
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- Contact Options Grid --- */}
            <section className="py-24 relative -mt-20 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ContactCard
                            icon={MessageCircle}
                            title="Live Chat"
                            description="Chat with our AI bot or get connected to a human agent instantly."
                            action="Start Chat"
                            color="bg-blue-500"
                            delay={0.1}
                        />
                        <ContactCard
                            icon={Mail}
                            title="Email Us"
                            description="Send us a detailed message and we'll reply within 2 hours."
                            action="support@247gbs.com"
                            color="bg-indigo-500"
                            delay={0.2}
                        />
                        <ContactCard
                            icon={Phone}
                            title="Call Support"
                            description="Speak directly with our technical team. Available 9 AM - 6 PM."
                            action="+44 20 1234 5678"
                            color="bg-pink-500"
                            delay={0.3}
                        />
                        <ContactCard
                            icon={Calendar}
                            title="Book Demo"
                            description="Schedule a 1-on-1 walkthrough of the platform features."
                            action="Book a Slot"
                            color="bg-orange-500"
                            delay={0.4}
                        />
                    </div>
                </div>
            </section>

            {/* --- Help Categories --- */}
            <section className="py-20 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Browse by Category</h2>
                        <p className="text-slate-500 text-lg">Find the documentation you need.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: FileText, title: "Getting Started", desc: "Setting up your account & profile" },
                            { icon: Zap, title: "Campaigns", desc: "Creating & managing promotions" },
                            { icon: Users, title: "Customer Loyalty", desc: "Rewards, tiers & points breakdown" },
                        ].map((cat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="flex items-start gap-6 p-6 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                    <cat.icon className="w-6 h-6 text-slate-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.title}</h3>
                                    <p className="text-slate-500 text-sm">{cat.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FAQ Section --- */}
            <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900 mb-6">Frequently Asked Questions</h2>
                        <p className="text-lg text-slate-600">Most of our support tickets are resolved with these answers.</p>
                    </div>

                    <div className="space-y-2">
                        <FAQItem
                            question="How do I reset my staff password?"
                            answer="You can reset staff passwords from the 'Staff Management' tab in your Admin dashboard. Simply click on the staff member's profile and select 'Reset Password'. An email will be sent to them immediately."
                        />
                        <FAQItem
                            question="Can I upgrade my plan at any time?"
                            answer="Yes! You can switch between 'Starter', 'Growth', and 'Enterprise' plans at any time. Changes take effect on your next billing cycle, and prorated differences will be calculated automatically."
                        />
                        <FAQItem
                            question="How does the V-Card loyalty system work?"
                            answer="The V-Card acts as a universal wallet for your customers. When they make a purchase, they scan their QR code to earn points or cashback. You can configure the earn rates in the 'Rewards Setup' page."
                        />
                        <FAQItem
                            question="Is there an integration for my POS system?"
                            answer="We support major POS providers like Lightspeed, Square, and Toast. Visit the 'Integrations' section in your settings to connect your device, or contact our technical team for custom hardware setups."
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Page;
