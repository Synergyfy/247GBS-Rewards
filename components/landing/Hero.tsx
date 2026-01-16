'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, TrendingUp } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-20 lg:pt-32 lg:pb-24 overflow-hidden bg-white">
      {/* Animated gradient orbs - Subtler for light theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-slate-50/50 z-0" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-l from-indigo-400 to-cyan-400 rounded-full blur-[100px]"
        />
      </div>

      {/* Grid pattern overlay - Adjusted for light theme */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMjIgNnYySDJ2LTJoMTJ6bTAtNHYtMkgydjJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-100 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 backdrop-blur-md shadow-sm">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4 text-blue-600 fill-blue-500" />
              </motion.div>
              <span className="text-sm font-bold text-blue-900 tracking-wide">Business Growth Engine</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6"
          >
            <span className="text-slate-900">Grow Your Business with </span>
            <span className="inline-block relative">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600">
                Everything in One
              </span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute bottom-2 left-0 h-3 bg-blue-200/50 rounded-full -z-10"
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Customers, rewards, cashback, marketing, software, and support —
            <span className="text-slate-900 font-bold underline decoration-orange-500/50 underline-offset-4"> all in one system</span>.
            247GBS is your complete business growth engine.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/signup">
              <button className="group relative w-full sm:w-auto px-10 py-5 rounded-full font-black text-xl bg-slate-950 text-white shadow-2xl shadow-slate-950/20 hover:bg-slate-900 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Join & Start Getting Rewards
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="#calculator">
              <button className="group w-full sm:w-auto px-10 py-5 rounded-full font-bold text-xl bg-white border-2 border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                See How Much I Could Earn
              </button>
            </Link>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-20"
          >
            {[
              { icon: Zap, text: "80+ Business Tools" },
              { icon: TrendingUp, text: "Cashback & Rewards" },
              { icon: Sparkles, text: "AI Assistants" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-black text-slate-900 tracking-tight">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>


        </div>
      </div>
    </section>
  );
};

export default Hero;
