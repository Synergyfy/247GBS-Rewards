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
    color: "bg-orange-600",
    size: "large"
  },
  {
    icon: Coins,
    title: "Rewards, Cashback & Loyalty",
    description: "Earn cashback, loyalty points, free products, vouchers — all stored in your V-Card wallet.",
    highlights: ["V-Card Wallet", "Cashback", "Loyalty Points"],
    color: "bg-orange-600",
    size: "medium"
  },
  {
    icon: Megaphone,
    title: "Customer Growth & Marketing",
    description: "QR campaigns, loyalty cards, coupons, vouchers, and local promotions to bring customers back automatically.",
    highlights: ["QR Campaigns", "Vouchers", "Local Promos"],
    color: "bg-orange-600",
    size: "medium"
  },
  {
    icon: Layers,
    title: "80+ Business Software Tools",
    description: "CRM, sales tracking, deal pipelines, campaign builder, support desk, AI assistants, dashboards & analytics.",
    highlights: ["CRM", "AI Assistants", "Analytics"],
    color: "bg-orange-600",
    size: "large"
  },
  {
    icon: CreditCard,
    title: "Machines & In-Store Tools",
    description: "Payment terminals, QR displays, loyalty scanners, and smart tills connected to your rewards system.",
    highlights: ["Payment Terminals", "QR Displays", "Smart Tills"],
    color: "bg-orange-600",
    size: "medium"
  },
  {
    icon: Users,
    title: "People & Support",
    description: "Account managers, business agents, AI assistants, help desk, and consultants — you're never alone.",
    highlights: ["Account Managers", "Help Desk", "Consultants"],
    color: "bg-orange-600",
    size: "medium"
  },
  {
    icon: UsersRound,
    title: "Group & National Power",
    description: "Join with other businesses for group buying, shared marketing, national campaigns, and partner promotions.",
    highlights: ["Group Buying", "Shared Marketing", "Partner Promos"],
    color: "bg-orange-600",
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
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100 px-4 py-2 rounded-full mb-6"
          >
            <Layers className="w-4 h-4" />
            Complete Business Suite
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Everything You Get with{' '}
            <span className="text-orange-600">
              247GBS
            </span>
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            A full business growth engine that brings you customers, money, tools, and people to help you grow.
          </p>
        </motion.div>

        {/* Bento grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="h-full relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 overflow-hidden">
                {/* Icon container - Solid background for max contrast */}
                <div className={`relative w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-orange-600/20 group-hover:scale-110 transition-all duration-300`}>
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
                <div className="flex items-center text-orange-600 font-bold text-sm group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
