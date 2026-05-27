'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-purple-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-purple-100/50 border border-purple-200 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8"
            >
              <span className="flex items-center gap-1">
                <Sparkles size={14} className="fill-purple-700" /> Earn Rewards Today
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6 leading-tight"
            >
              Get Rewarded for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Being You
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed"
            >
              Join our exclusive loyalty program. Earn points on every purchase, unlock special perks, and enjoy rewards designed just for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link href="/signup">
                <button className="w-full sm:w-auto px-8 py-4 bg-purple-600 text-white rounded-full font-semibold text-lg hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2 group">
                  Join Now for Free
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#how-it-works">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all">
                  How it Works
                </button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
             {/* Decorative Elements replacing the image for now */}
             <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center animate-blob filter blur-3xl opacity-30 absolute top-0 -left-4"></div>
             <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center animate-blob animation-delay-2000 filter blur-3xl opacity-30 absolute bottom-0 -right-4"></div>

             <div className="relative z-10 w-full max-w-sm bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 transform rotate-[-3deg] hover:rotate-0 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Current Balance</p>
                        <h3 className="text-3xl font-bold text-gray-900">2,450 <span className="text-sm font-normal text-purple-600">pts</span></h3>
                    </div>
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Sparkles size={20} className="text-purple-600" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-2xl">☕</div>
                        <div>
                            <h4 className="font-semibold text-gray-900">Free Coffee</h4>
                            <p className="text-xs text-gray-500">500 pts</p>
                        </div>
                        <button className="ml-auto text-xs font-semibold bg-purple-600 text-white px-3 py-1.5 rounded-full">Redeem</button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-2xl">👕</div>
                        <div>
                            <h4 className="font-semibold text-gray-900">20% Off Tee</h4>
                            <p className="text-xs text-gray-500">1000 pts</p>
                        </div>
                        <button className="ml-auto text-xs font-semibold bg-gray-200 text-gray-500 px-3 py-1.5 rounded-full">Locked</button>
                    </div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
