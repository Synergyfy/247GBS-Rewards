'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, Headphones } from 'lucide-react';

const stats = [
  {
    value: "80+",
    label: "Business Tools",
    description: "CRM, Sales, Marketing & More",
    icon: TrendingUp,
    color: "bg-orange-600"
  },
  {
    value: "10K+",
    label: "Active Businesses",
    description: "Growing Daily",
    icon: Users,
    color: "bg-slate-900"
  },
  {
    value: "£5M+",
    label: "Rewards Given",
    description: "Cashback & Points",
    icon: Award,
    color: "bg-orange-600"
  },
  {
    value: "24/7",
    label: "Support",
    description: "We Never Sleep",
    icon: Headphones,
    color: "bg-slate-900"
  },
];

const Stats = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 bg-orange-50 px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Trusted by Thousands
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Numbers That Speak for Themselves
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-orange-500/10 group-hover:border-orange-200">
                {/* Border accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${stat.color}`} />

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>

                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tight">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-lg font-semibold text-slate-700 mb-1">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-sm text-slate-500">
                  {stat.description}
                </div>

                {/* Hover effect - Solid border on hover instead of blur */}
                <div className={`absolute bottom-0 right-0 w-32 h-32 ${stat.color} opacity-0 group-hover:opacity-5 rounded-tl-full transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
