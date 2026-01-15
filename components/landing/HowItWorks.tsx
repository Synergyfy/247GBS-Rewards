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
    icon: ClipboardCheck
  },
  {
    title: "Step 2: System Setup",
    description: "We deploy our 80+ tools and rewards systems tailored to your business needs.",
    benefits: ["Custom CRM", "Reward Engine", "Dashboard Access"],
    icon: Settings2
  },
  {
    title: "Step 3: Launch Growth",
    description: "Launch targeted marketing campaigns and start giving rewards to your customers.",
    benefits: ["Local promos", "QR campaigns", "Voucher issuance"],
    icon: Rocket
  },
  {
    title: "Step 4: Scale Revenue",
    description: "Watch your revenue grow as customers return more often and spend more per visit.",
    benefits: ["Higher retention", "Increased basket size", "National power"],
    icon: TrendingUp
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-orange-600 font-bold tracking-widest text-sm uppercase"
          >
            Our Simple Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-4 mb-6"
          >
            How We Grow Your Business
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 font-medium"
          >
            A clear, results-driven path from where you are today to where you want to be.
          </motion.p>
        </div>

        <div className="relative">
          {/* Timeline Line - Desktop */}
          <div className="absolute top-[40%] left-0 w-full h-1 bg-slate-200 hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-600/30 transition-all group pt-12"
              >
                {/* Step Marker */}
                <div className="absolute -top-6 left-8 lg:left-1/2 lg:-translate-x-1/2 w-12 h-12 bg-orange-600 border-4 border-white text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-orange-600/20 z-10 transition-transform group-hover:scale-110">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-50 transition-colors">
                  <step.icon className="w-7 h-7 text-orange-600" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4 transition-colors group-hover:text-orange-600">
                  {step.title}
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">
                  {step.description}
                </p>

                <ul className="space-y-3">
                  {step.benefits.map((benefit, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link href="/signup">
            <button className="px-10 py-5 bg-orange-600 text-white rounded-full font-extrabold text-xl shadow-2xl shadow-orange-600/30 hover:bg-orange-700 hover:scale-105 transition-all flex items-center gap-3 mx-auto">
              Start Your Journey Today
              <ArrowRight className="w-6 h-6" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
