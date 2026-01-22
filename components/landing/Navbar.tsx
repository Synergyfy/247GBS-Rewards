'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const seasons = [
    { name: 'Summer Campaign', href: '/season/summer', icon: '☀️' },
    { name: 'Autumn Campaign', href: '/season/autumn', icon: '🍂' },
    { name: 'Winter Campaign', href: '/season/winter', icon: '❄️' },
    { name: 'Spring Campaign', href: '/season/spring', icon: '🌸' },
  ];

  return (
    <nav className={`fixed w-full z-50 top-0 left-0 right-0 transition-all duration-300 ${scrolled
      ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm'
      : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="relative w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">G</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900">
                247GBS
              </span>
              <span className="text-xs text-slate-500">
                Business Solutions
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {/* Season Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowSeasonDropdown(true)}
              onMouseLeave={() => setShowSeasonDropdown(false)}
            >
              <button
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-1 ${showSeasonDropdown ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
              >
                Season
                <motion.span
                  animate={{ rotate: showSeasonDropdown ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px]"
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence>
                {showSeasonDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 overflow-hidden"
                  >
                    <div className="flex flex-col gap-1">
                      {seasons.map((season) => (
                        <a
                          key={season.name}
                          href={season.href}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-all group"
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform">{season.icon}</span>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                            {season.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/feature"
              className="px-4 py-2 rounded-full font-medium transition-all text-slate-600 hover:text-blue-600 hover:bg-blue-50"
            >
              Features
            </Link>
            <Link
              href="/support"
              className="px-4 py-2 rounded-full font-medium transition-all text-slate-600 hover:text-blue-600 hover:bg-blue-50"
            >
              Support
            </Link>

            <div className="flex items-center gap-3 ml-6">
              <Link href="/signin">
                <button className="group px-6 py-2.5 rounded-full font-bold bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all flex items-center gap-2">
                  <span className="relative z-10">Sign In</span>
                  <Sparkles className="w-4 h-4 fill-white animate-pulse" />
                </button>
              </Link>
              <Link href="/partner">
                <button className="px-6 py-2.5 rounded-full font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                  Partner
                </button>
              </Link>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors text-slate-700 hover:bg-slate-100"
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
              <div className="py-2">
                <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Seasonal Campaigns</p>
                {seasons.map((season) => (
                  <a
                    key={season.name}
                    href={season.href}
                    className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{season.icon}</span>
                    {season.name}
                  </a>
                ))}
              </div>

              <Link
                href="/feature"
                className="block px-4 py-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/support"
                className="block px-4 py-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                Support
              </Link>

              <div className="border-t border-slate-100 my-3 pt-3">
                <Link href="/signin" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-center bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 mb-3">
                  Sign In
                </Link>
                <Link href="/partner" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-center bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                  Partner
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
