'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, TrendingUp, CheckCircle, Smartphone } from 'lucide-react';
import Image from 'next/image';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-white">
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

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMjIgNnYySDJ2LTJoMTJ6bTAtNHYtMkgydjJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-100 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column: Text Content */}
          <motion.div
            style={{ y, opacity }}
            className="text-left"
          >
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 shadow-sm transition-all hover:bg-blue-100/50">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
            >
              <span className="text-slate-900 block mb-2">Grow Your Business with </span>
              <span className="inline-block relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-300% animate-gradient">
                  Everything in One
                </span>
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute bottom-2 left-0 h-3 bg-blue-200/50 rounded-full -z-10"
                />
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed font-medium"
            >
              Transform your business with a complete ecosystem. Customers, rewards, cashback, marketing, and AI-powered insights —
              <span className="text-slate-900 font-bold underline decoration-blue-500/30 underline-offset-4 decoration-2"> all in one powerful dashboard</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-12"
            >
              <Link href="/signup">
                <button className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-lg bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95">
                  Start Growth Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#calculator">
                <button className="group w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Request Demo
                </button>
              </Link>
            </motion.div>

            {/* Mini Features */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 text-sm font-semibold text-slate-500"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span>14-day free trial</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Phone Mockup / Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative lg:h-[800px] flex items-center justify-center pointer-events-none"
          >
            {/* Blob Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100/50 to-indigo-100/50 rounded-full blur-3xl opacity-70" />

            {/* CSS Phone Mockup */}
            <div className="relative z-10 w-[300px] sm:w-[350px] h-[600px] sm:h-[700px] bg-slate-900 rounded-[3rem] p-4 shadow-2xl shadow-blue-900/20 border-8 border-slate-900 ring-1 ring-slate-900/5">
              {/* Screen Content */}
              <div className="w-full h-full bg-slate-50 rounded-[2.2rem] overflow-hidden relative flex flex-col">
                {/* Status Bar */}
                <div className="absolute top-0 w-full h-6 bg-slate-900/5 z-20 flex justify-between px-6 items-center text-[10px] font-bold text-slate-900">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-slate-900 rounded-full opacity-20" />
                    <div className="w-3 h-3 bg-slate-900 rounded-full opacity-20" />
                  </div>
                </div>

                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-slate-900 rounded-b-xl z-20" />

                {/* App UI */}
                <div className="flex-1 bg-white overflow-hidden relative">
                  {/* Header */}
                  <div className="bg-blue-600 h-40 rounded-b-[2.5rem] p-6 pt-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md" />
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">Hello, Business!</h3>
                    <p className="text-blue-100 text-sm">Welcome to your dashboard</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="px-6 -mt-8 relative z-10 grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-lg shadow-slate-200/50 flex flex-col gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <TrendingUp size={16} />
                      </div>
                      <span className="text-xs text-slate-500 font-bold">Revenue</span>
                      <span className="text-xl font-black text-slate-900">$12.4k</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-lg shadow-slate-200/50 flex flex-col gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <Zap size={16} />
                      </div>
                      <span className="text-xs text-slate-500 font-bold">Active Users</span>
                      <span className="text-xl font-black text-slate-900">842</span>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="px-6 mt-6">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <div className="flex justify-between items-end h-24 gap-2">
                        {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: '0%' }}
                            whileInView={{ height: `${h}%` }}
                            transition={{ duration: 0.5, delay: 0.5 + (i * 0.1) }}
                            className="w-full bg-blue-500 rounded-t-md opacity-80"
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase">
                        <span>Mon</span>
                        <span>Sun</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 right-6 bg-white p-4 rounded-2xl shadow-xl shadow-blue-900/10 border border-slate-100 z-20 max-w-[150px]"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Sparkles size={14} />
                      </div>
                      <div className="text-xs font-bold text-slate-800">New Reward!</div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-green-500 rounded-full" />
                    </div>
                  </motion.div>

                </div>

                {/* Bottom Bar */}
                <div className="h-1 bg-slate-900 mx-auto w-1/3 rounded-full absolute bottom-2 left-1/2 -translate-x-1/2" />
              </div>

              {/* Buttons */}
              <div className="absolute top-24 -left-[2px] w-[2px] h-8 bg-slate-800 rounded-l-md" />
              <div className="absolute top-36 -left-[2px] w-[2px] h-14 bg-slate-800 rounded-l-md" />
              <div className="absolute top-36 -right-[2px] w-[2px] h-14 bg-slate-800 rounded-r-md" />

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
