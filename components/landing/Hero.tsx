'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, TrendingUp, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-20 lg:pt-32 lg:pb-24 overflow-hidden bg-slate-950">
      {/* Animated gradient orbs - Increased opacity for visibility */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-0" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-r from-orange-600/30 to-amber-600/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-l from-amber-600/30 to-rose-600/30 rounded-full blur-[100px]"
        />
      </div>

      {/* Grid pattern overlay - Reduced opacity to not interfere with text */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMjIgNnYySDJ2LTJoMTJ6bTAtNHYtMkgydjJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-orange-500/30 backdrop-blur-md shadow-lg shadow-orange-900/20">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4 text-orange-400 fill-orange-400" />
              </motion.div>
              <span className="text-sm font-semibold text-orange-100 tracking-wide">Business Growth Engine</span>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-white drop-shadow-sm">Grow Your Business with </span>
            <span className="inline-block relative">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 drop-shadow-sm">
                Everything in One
              </span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute bottom-2 left-0 h-3 bg-orange-600/30 rounded-full -z-10"
              />
            </span>
          </motion.h1>

          {/* Subheadline - Increased brightness and contrast */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Customers, rewards, cashback, marketing, software, and support —
            <span className="text-white font-bold underline decoration-orange-500/50 underline-offset-4"> all in one system</span>.
            247GBS is your complete business growth engine.
          </motion.p>

          {/* CTA Buttons - Enhanced visibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/signup">
              <button className="group relative w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg overflow-hidden shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                  Join & Start Getting Rewards
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
            <Link href="#calculator">
              <button className="group w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg bg-slate-800/80 border border-slate-700 text-white backdrop-blur-sm hover:bg-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 shadow-lg">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                See How Much I Could Earn
              </button>
            </Link>
          </motion.div>

          {/* Feature highlights - Brighter icons and text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-16"
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
                className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-bold text-white tracking-wide">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Dashboard preview with glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative max-w-5xl mx-auto"
          >
            {/* Glow effect behind dashboard */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 blur-3xl scale-95" />

            {/* Dashboard container */}
            <div className="relative bg-slate-900 border border-slate-700 rounded-3xl p-2 shadow-2xl shadow-black/80">
              {/* Window controls */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-800/50 rounded-t-2xl">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-lg bg-slate-950 text-xs text-slate-400 border border-slate-800">
                    dashboard.247gbs.com
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-4 sm:p-6 bg-slate-900 rounded-b-2xl">
                <div className="grid grid-cols-12 gap-4">
                  {/* Sidebar */}
                  <div className="col-span-3 hidden md:block space-y-3">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className={`h-8 rounded-lg ${i === 0 ? 'bg-gradient-to-r from-orange-600 to-amber-600 shadow-md' : 'bg-slate-800'}`}
                      />
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="col-span-12 md:col-span-9 space-y-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Revenue", value: "£2.4M", change: "+23%" },
                        { label: "Customers", value: "1,234", change: "+12%" },
                        { label: "Rewards", value: "5.6K", change: "+45%" },
                      ].map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2 + i * 0.1 }}
                          className="bg-slate-800 border border-slate-700 rounded-xl p-3 sm:p-4"
                        >
                          <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                          <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
                          <p className="text-xs text-emerald-400 font-medium">{stat.change}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Chart area */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5 }}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 h-48 sm:h-56 relative overflow-hidden group/chart"
                    >
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-20">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-full h-[1px] bg-slate-500" />
                        ))}
                      </div>

                      {/* SVG Line Chart Overlay */}
                      <svg className="absolute inset-x-4 bottom-4 w-[calc(100%-32px)] h-3/4 z-10 overflow-visible">
                        <motion.path
                          d="M 0 100 Q 10 40, 20 60 T 40 20 T 60 80 T 80 40 T 100 10"
                          fill="none"
                          stroke="url(#gradient-line)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 2, delay: 2, ease: "easeInOut" }}
                          style={{ filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))' }}
                        />
                        <defs>
                          <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#fbbf24" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* Bar charts */}
                      <div className="absolute inset-x-4 bottom-4 h-3/4 flex items-end justify-around gap-2 z-0">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                          <div key={i} className="flex-1 relative group/bar">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: 1.6 + i * 0.05, duration: 0.8, ease: "circOut" }}
                              className="w-full bg-gradient-to-t from-orange-600 to-amber-400 rounded-t-sm shadow-[0_0_15px_rgba(249,115,22,0.2)] group-hover/bar:brightness-125 transition-all"
                            />
                            {/* Bar glow on hover */}
                            <div className="absolute inset-0 bg-orange-500/20 blur-md opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>

                      {/* Floating tooltip simulation */}
                      <motion.div
                        animate={{
                          x: [0, 20, 0],
                          y: [0, -10, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 border border-orange-500/30 rounded-full shadow-lg z-20 pointer-events-none"
                      >
                        <span className="text-[10px] font-bold text-orange-400">+124% Growth</span>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl rotate-12 blur-sm opacity-20"
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl -rotate-12 blur-sm opacity-20"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default Hero;
