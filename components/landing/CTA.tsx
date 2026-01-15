'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Calculator, CheckCircle2 } from 'lucide-react';

const benefits = [
  "Cashback on every transaction",
  "80+ business tools included",
  "Free business audit",
  "24/7 dedicated support"
];

const CTA = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative bg-orange-600 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-600/30">
            <div className="relative z-10 p-8 md:p-16 lg:p-20 text-center">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm mb-8"
                >
                  <Sparkles className="w-4 h-4 text-white fill-white" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Start Earning Today</span>
                </motion.div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                  Ready to Grow Your Business?
                </h2>

                <p className="text-xl text-orange-50 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                  Join thousands of businesses already using 247GBS to grow revenue,
                  engage customers, and earn rewards on every transaction.
                </p>

                <ul className="flex flex-wrap justify-center gap-6 mb-12">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-white text-base font-bold">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link href="/signup">
                    <button className="group relative w-full sm:w-auto px-10 py-5 rounded-full font-black text-xl bg-white text-orange-600 shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                      Join 247GBS Now
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link href="#calculator">
                    <button className="w-full sm:w-auto px-10 py-5 rounded-full font-bold text-xl bg-orange-700 text-white border border-orange-500 hover:bg-orange-800 transition-all flex items-center justify-center gap-2">
                      <Calculator className="w-6 h-6 text-white" />
                      See Earnings
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Subtle Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
