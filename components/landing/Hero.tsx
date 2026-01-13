'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-100/50 border border-blue-200 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8"
          >
            <span className="flex items-center gap-1">
              <Star size={14} className="fill-blue-700" /> New Features Available
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-8 leading-tight"
          >
            Build Customer Loyalty <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              That Lasts Forever
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Launch a powerful loyalty program in minutes. Engage customers, boost retention, and drive revenue with our all-in-one platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup">
              <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group">
                Start Free Trial
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="#demo">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all">
                View Demo
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-full w-full pointer-events-none"></div>
            <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 p-2 sm:p-4 max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
                <div className="bg-gray-800 rounded-xl overflow-hidden aspect-[16/9] relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono">
                        [Dashboard Preview Dashboard Image Placeholder]
                    </div>
                    {/* Simulated UI elements */}
                    <div className="absolute top-0 left-0 w-full h-full p-8 grid grid-cols-4 gap-6 opacity-20">
                        <div className="col-span-1 bg-white/10 rounded-lg h-full"></div>
                        <div className="col-span-3 grid grid-rows-3 gap-6">
                            <div className="row-span-1 flex gap-6">
                                <div className="bg-white/10 rounded-lg w-1/3"></div>
                                <div className="bg-white/10 rounded-lg w-1/3"></div>
                                <div className="bg-white/10 rounded-lg w-1/3"></div>
                            </div>
                            <div className="row-span-2 bg-white/10 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/10 rounded-full blur-[100px]" />
      </div>
    </section>
  );
};

export default Hero;
