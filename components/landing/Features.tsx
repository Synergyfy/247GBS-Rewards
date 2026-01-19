'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  Coins,
  Megaphone,
  Layers,
  CreditCard,
  Users,
  Rocket,
  UsersRound,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: ClipboardCheck,
    title: "Business Audit & Growth Engine",
    description: "Understand what's selling, what's not, where profit can be made, and what campaigns to run. Get actionable insights daily.",
    highlights: ["Sales Analysis", "Stock Optimization", "Staff Utilization"],
    color: "bg-blue-600",
    size: "large"
  },
  {
    icon: Coins,
    title: "Rewards, Cashback & Loyalty",
    description: "Earn cashback, loyalty points, free products, vouchers — all stored in your V-Card wallet.",
    highlights: ["V-Card Wallet", "Cashback", "Loyalty Points"],
    color: "bg-blue-600",
    size: "medium"
  },
  {
    icon: Megaphone,
    title: "Customer Growth & Marketing",
    description: "QR campaigns, loyalty cards, coupons, vouchers, and local promotions to bring customers back automatically.",
    highlights: ["QR Campaigns", "Vouchers", "Local Promos"],
    color: "bg-blue-600",
    size: "medium"
  },
  {
    icon: Layers,
    title: "80+ Business Software Tools",
    description: "CRM, sales tracking, deal pipelines, campaign builder, support desk, AI assistants, dashboards & analytics.",
    highlights: ["CRM", "AI Assistants", "Analytics"],
    color: "bg-blue-600",
    size: "large"
  },
  {
    icon: CreditCard,
    title: "Machines & In-Store Tools",
    description: "Payment terminals, QR displays, loyalty scanners, and smart tills connected to your rewards system.",
    highlights: ["Payment Terminals", "QR Displays", "Smart Tills"],
    color: "bg-blue-600",
    size: "medium"
  },
  {
    icon: Users,
    title: "People & Support",
    description: "Account managers, business agents, AI assistants, help desk, and consultants — you're never alone.",
    highlights: ["Account Managers", "Help Desk", "Consultants"],
    color: "bg-blue-600",
    size: "medium"
  },
  {
    icon: UsersRound,
    title: "Group & National Power",
    description: "Join with other businesses for group buying, shared marketing, national campaigns, and partner promotions.",
    highlights: ["Group Buying", "Shared Marketing", "Partner Promos"],
    color: "bg-blue-600",
    size: "medium"
  },
  {
    icon: Rocket,
    title: "Why 247GBS Is Different",
    description: "We don't sell tools. We give you customers, money, rewards, marketing, software, and support — everything to grow.",
    highlights: ["Complete Solution", "Real Results", "Business Growth"],
    color: "bg-slate-900",
    size: "medium"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-6"
          >
            <Layers className="w-4 h-4" />
            Complete Business Suite
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Everything You Get with{' '}
            <span className="text-blue-600">
              247GBS
            </span>
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            A full business growth engine that brings you customers, money, tools, and people to help you grow.
          </p>
        </motion.div>

        {/* Bento grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`group relative ${feature.size === 'large' ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
            >
              <div className="h-full relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
                {/* Icon container - Solid background for max contrast */}
                <div className={`relative w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-lg ${feature.color === 'bg-slate-900' ? 'shadow-slate-900/20' : 'shadow-blue-600/20'} group-hover:scale-110 transition-all duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                  {feature.description}
                </p>

                {/* Highlight tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {feature.highlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Arrow indicator on hover */}
                <div className="flex items-center text-blue-600 font-bold text-sm group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* New Side-by-Side Section: Analytics Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Visual representation of Analytics */}
            <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border-4 border-slate-900">
              {/* Background Decor */}
              <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-blue-600/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-600/20 rounded-full blur-[80px]" />

              {/* UI Mockup - Charts */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6 w-full">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-4 w-1/3 bg-white/20 rounded-full" />
                    <div className="h-8 w-24 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center text-xs font-bold">+24.5%</div>
                  </div>
                  <div className="flex items-end gap-2 h-32">
                    {[30, 45, 35, 60, 55, 75, 40, 65, 50, 80].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-500 rounded-t-sm opacity-80" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl mb-3 flex items-center justify-center">
                      <Coins className="text-white w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">8,420</div>
                    <div className="text-xs text-blue-200 font-medium">Points Redeemed</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl mb-3 flex items-center justify-center">
                      <Users className="text-white w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">1,250</div>
                    <div className="text-xs text-blue-200 font-medium">New Customers</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Rocket className="w-4 h-4" />
              Growth Intelligence
            </div>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              See Exactly How Your Business is <span className="text-blue-600">Growing</span>
            </h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Stop guessing. Our AI-powered analytics engine tracks every transaction, reward redemption, and customer visit. You'll know exactly which campaigns are working and where your revenue is coming from.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                "Real-time revenue tracking",
                "Customer retention heatmaps",
                "Campaign ROI analysis",
                "Staff performance metrics"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                    <ClipboardCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-slate-700">{item}</span>
                </li>
              ))}
            </ul>

            <button className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 group">
              Explore Analytics
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
