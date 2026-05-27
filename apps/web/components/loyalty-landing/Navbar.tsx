'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 top-0 left-0 right-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              247GBS Loyalty
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#benefits" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Benefits</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">How it Works</a>
            <a href="#rewards" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Rewards</a>
            <div className="flex items-center gap-4 ml-4">
              <Link href="/signin">
                <button className="text-gray-900 font-medium hover:text-purple-600 transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-purple-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20">
                  Join Program
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
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden absolute top-20 left-0 w-full shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a href="#benefits" className="block px-3 py-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium" onClick={() => setIsOpen(false)}>Benefits</a>
              <a href="#how-it-works" className="block px-3 py-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium" onClick={() => setIsOpen(false)}>How it Works</a>
              <a href="#rewards" className="block px-3 py-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium" onClick={() => setIsOpen(false)}>Rewards</a>
              <div className="border-t border-gray-100 my-2 pt-2 space-y-2">
                <Link href="/signin" className="block px-3 py-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" className="block px-3 py-3 text-center bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700" onClick={() => setIsOpen(false)}>
                  Join Program
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
