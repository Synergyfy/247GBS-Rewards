'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 top-0 left-0 right-0 transition-all duration-300 ${scrolled
      ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm'
      : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="relative w-11 h-11 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">G</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                247GBS
              </span>
              <span className={`text-xs ${scrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                Business Solutions
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/feature"
              className={`px-4 py-2 rounded-full font-medium transition-all ${scrolled
                ? 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
                : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
            >
              Features
            </Link>
            <a
              href="#campaign"
              className={`px-4 py-2 rounded-full font-medium transition-all ${scrolled
                ? 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
                : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
            >
              Campaign
            </a>
            <div className="flex items-center gap-3 ml-6">
              <Link href="/signin">
                <button className="group px-6 py-2.5 rounded-full font-bold bg-orange-600 text-white shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/30 transition-all flex items-center gap-2">
                  <Sparkles className="w-4 h-4 fill-white" />
                  Get Started
                </button>
              </Link>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden absolute top-20 left-0 w-full shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link
                href="/feature"
                className="block px-4 py-3 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <a
                href="#campaign"
                className="block px-4 py-3 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                Campaign
              </a>
              <div className="border-t border-slate-100 my-3 pt-3">
                <Link href="/signin" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-center bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-600/20">
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
