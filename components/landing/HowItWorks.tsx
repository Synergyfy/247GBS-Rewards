'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ClipboardCheck,
  Settings2,
  Rocket,
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const steps = [
  {
    title: "Step 1: Free Audit",
    description: "We analyze your current operations to find growth opportunities and hidden profits.",
    benefits: ["Identify waste", "Optimize pricing", "Staff productivity"],
    icon: ClipboardCheck,
    color: "bg-orange-500"
  },
  {
    title: "Step 2: System Setup",
    description: "We deploy our 80+ tools and rewards systems tailored to your business needs.",
    benefits: ["Custom CRM", "Reward Engine", "Dashboard Access"],
    icon: Settings2,
    color: "bg-blue-600"
  },
  {
    title: "Step 3: Launch Growth",
    description: "Launch targeted marketing campaigns and start giving rewards to your customers.",
    benefits: ["Local promos", "QR campaigns", "Voucher issuance"],
    icon: Rocket,
    color: "bg-purple-600"
  },
  {
    title: "Step 4: Scale Revenue",
    description: "Watch your revenue grow as customers return more often and spend more per visit.",
    benefits: ["Higher retention", "Increased basket size", "National power"],
    icon: TrendingUp,
    color: "bg-green-500"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMwMDA1MjUiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-100" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="px-4 py-1.5 rounded-full bg-white border border-blue-100 text-blue-600 font-bold tracking-wide text-xs uppercase shadow-sm mb-6 inline-flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Our Simple Process
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 tracking-tight"
          >
            From Audit to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Growth</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 font-medium leading-relaxed"
          >
            We don't just give you software. We partner with you to implement a proven strategy that drives real revenue results.
          </motion.p>
        </div>

        <div className="relative">
          {/* Timeline Line - Desktop */}
          <div className="absolute top-[35%] left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent hidden lg:block opacity-50" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all duration-300 group pt-16"
              >
                {/* Step Marker */}
                <div className="absolute -top-6 left-8 lg:left-1/2 lg:-translate-x-1/2 w-14 h-14 bg-white border-4 border-slate-50 text-slate-900 rounded-full flex items-center justify-center font-black text-xl shadow-lg z-10 group-hover:scale-110 group-hover:border-blue-50 transition-all">
                  <span className="relative z-10">{index + 1}</span>
                  <div className={`absolute inset-0 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${step.color}`} />
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${step.color} shadow-lg shadow-blue-900/5 flex items-center justify-center mb-6 text-white transform group-hover:rotate-6 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-8 h-24">
                  {step.description}
                </p>

                <div className="space-y-3 pt-6 border-t border-slate-100">
                  {step.benefits.map((benefit, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <CheckCircle2 className={`w-4 h-4 ${step.color.replace('bg-', 'text-')} flex-shrink-0`} />
                      {benefit}
                    </li>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-24 text-center"
        >
          <Link href="/signup">
            <button className="px-12 py-6 bg-slate-900 text-white rounded-full font-black text-xl shadow-2xl shadow-slate-900/30 hover:bg-black hover:scale-105 transition-all flex items-center gap-3 mx-auto group">
              Start Your Journey Today
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
