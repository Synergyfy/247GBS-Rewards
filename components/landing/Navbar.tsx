'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              LoyaltyPro
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">How it Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Testimonials</a>
            <div className="flex items-center gap-4 ml-4">
              <Link href="/signin">
                <button className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                  Get Started
                </button>
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a href="#features" className="block px-3 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium" onClick={() => setIsOpen(false)}>Features</a>
              <a href="#how-it-works" className="block px-3 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium" onClick={() => setIsOpen(false)}>How it Works</a>
              <a href="#testimonials" className="block px-3 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium" onClick={() => setIsOpen(false)}>Testimonials</a>
              <div className="border-t border-gray-100 my-2 pt-2 space-y-2">
                <Link href="/signin" className="block px-3 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
                <Link href="/signup" className="block px-3 py-3 text-center bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
