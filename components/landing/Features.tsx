'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Users, BarChart3, Settings, Smartphone, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: <Gift className="w-6 h-6 text-white" />,
    title: "Smart Rewards",
    description: "Create customizable rewards that your customers actually want. From discounts to exclusive perks.",
    color: "bg-pink-500"
  },
  {
    icon: <Users className="w-6 h-6 text-white" />,
    title: "Customer Management",
    description: "Track customer behavior, preferences, and history to personalize their experience.",
    color: "bg-blue-500"
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    title: "Advanced Analytics",
    description: "Get real-time insights into your program's performance and ROI.",
    color: "bg-violet-500"
  },
  {
    icon: <Smartphone className="w-6 h-6 text-white" />,
    title: "Mobile First",
    description: "A seamless experience for your customers on any device. No app download required.",
    color: "bg-orange-500"
  },
  {
    icon: <Settings className="w-6 h-6 text-white" />,
    title: "Easy Configuration",
    description: "Set up your campaign rules, points system, and branding in minutes.",
    color: "bg-green-500"
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
    title: "Secure & Reliable",
    description: "Enterprise-grade security to keep your business and customer data safe.",
    color: "bg-teal-500"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Features</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Everything you need to grow customer loyalty
          </h3>
          <p className="text-xl text-gray-600">
            Our platform provides all the tools you need to build, manage, and scale a successful loyalty program.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color} shadow-lg group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
