'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: "10k+", label: "Active Businesses" },
  { value: "5M+", label: "Rewards Redeemed" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const Stats = () => {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-blue-100 font-medium text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
