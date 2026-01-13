'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Coffee, Ticket, Crown } from 'lucide-react';

const rewards = [
  {
    icon: <Coffee className="w-6 h-6 text-white" />,
    title: "Free Coffee",
    points: "500 pts",
    color: "bg-amber-500"
  },
  {
    icon: <Tag className="w-6 h-6 text-white" />,
    title: "20% Off Coupon",
    points: "1000 pts",
    color: "bg-blue-500"
  },
  {
    icon: <Ticket className="w-6 h-6 text-white" />,
    title: "VIP Event Access",
    points: "2500 pts",
    color: "bg-purple-500"
  },
  {
    icon: <Crown className="w-6 h-6 text-white" />,
    title: "Platinum Status",
    points: "5000 pts",
    color: "bg-gray-800"
  }
];

const RewardsPreview = () => {
  return (
    <section id="rewards" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-purple-600 font-semibold tracking-wide uppercase text-sm mb-3">Rewards</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Exclusive Perks Waiting For You
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Unlock a world of benefits. From small treats to grand experiences, our rewards catalog has something for everyone.
            </p>
            <ul className="space-y-4">
                {['Birthday Surprises', 'Early Access to Sales', 'Double Points Days', 'Free Shipping'].map((item, i) =>(
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        {item}
                    </li>
                ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rewards.map((reward, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${reward.color} shadow-md`}>
                  {reward.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">{reward.title}</h4>
                <p className="text-purple-600 font-medium">{reward.points}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RewardsPreview;
