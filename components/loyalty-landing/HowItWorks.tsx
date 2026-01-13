'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Gift, Smartphone } from 'lucide-react';

const steps = [
  {
    icon: <ShoppingBag className="w-8 h-8 text-purple-600" />,
    title: "Shop Your Favorites",
    description: "Purchase products you love from our store or partners."
  },
  {
    icon: <Star className="w-8 h-8 text-purple-600" />,
    title: "Earn Points",
    description: "Get points for every dollar spent. Bonus points for special events!"
  },
  {
    icon: <Gift className="w-8 h-8 text-purple-600" />,
    title: "Redeem Rewards",
    description: "Trade your points for discounts, free items, and exclusive access."
  },
  {
    icon: <Smartphone className="w-8 h-8 text-purple-600" />,
    title: "Manage on Mobile",
    description: "Track your balance and redeem rewards directly from your phone."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-purple-600 font-semibold tracking-wide uppercase text-sm mb-3">Simple & Rewarding</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            How it Works
          </h3>
          <p className="text-xl text-gray-600">
            Earning rewards is as easy as shopping. No complicated rules, just points for your purchases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-purple-50 transition-colors"
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h4>
              <p className="text-gray-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
