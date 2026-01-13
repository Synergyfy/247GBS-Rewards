'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Sign Up & Setup",
    description: "Create your business account and configure your loyalty program settings in minutes."
  },
  {
    number: "02",
    title: "Create Campaigns",
    description: "Launch targeted campaigns to engage your customers and offer exciting rewards."
  },
  {
    number: "03",
    title: "Connect Staff",
    description: "Add your staff members so they can award points and redeem rewards for customers."
  },
  {
    number: "04",
    title: "Watch it Grow",
    description: "Monitor your dashboard to see customer retention rise and revenue grow."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">How it Works</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Simple steps to success
          </h3>
          <p className="text-xl text-gray-600">
            Getting started with your loyalty program hasn&apos;t been easier.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative bg-gray-50 lg:bg-transparent"
              >
                <div className="w-16 h-16 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center text-xl font-bold text-blue-600 shadow-lg mx-auto mb-6 relative z-10">
                  {step.number}
                </div>
                <div className="text-center px-4">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h4>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
