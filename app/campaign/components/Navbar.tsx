'use client';

import React, { useState } from 'react';
import logo from '../../../public/campaign/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Menu, X, User, Gift, Wallet, Phone, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { topTitle, topHeadline, primaryBg, primaryText } = useSelector(
    (state: RootState) => state.campaing
  );
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);

  if (pathname === '/campaign') return null;

  const navItems = [
    { name: 'Campaign', link: '/campaign', icon: Zap },
    { name: 'Earn', link: '/campaign/earn-points', icon: Wallet },
    { name: 'Redeem', link: '/campaign/redeem-points', icon: Gift },
    { name: 'Activity', link: '/campaign/my-points', icon: User },
    { name: 'Support', link: '/campaign/contact', icon: Phone },
  ];

  return (
    <nav
      className="sticky top-0 z-50 w-full h-24 border-b border-white/10 backdrop-blur-md transition-all duration-300"
      style={{ backgroundColor: primaryBg || '#FFFFFF', color: primaryText || '#1A1A1A' }}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/campaign" className="flex items-center gap-4 group">
          <div className="relative w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image src={logo} alt="logo" className="w-8 h-8 object-contain" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tight leading-tight">{topTitle || 'Loyalty'}</h1>
            <p className="text-xs font-bold opacity-60 uppercase tracking-widest">{topHeadline || 'Rewards Program'}</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.link;
            return (
              <Link key={item.link} href={item.link}>
                <div className={cn(
                  "px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm transition-all duration-200",
                  isActive
                    ? "bg-[#2D3DFF] text-white shadow-md"
                    : "hover:bg-black/5 opacity-80 hover:opacity-100"
                )}>
                  <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-[#2D3DFF]")} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="md:hidden p-2 rounded-xl bg-black/5"
        >
          {openMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {openMenu && (
        <div className="absolute top-24 left-0 w-full bg-white shadow-2xl border-t border-gray-100 md:hidden animate-in slide-in-from-top-4 duration-300">
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.link;
              return (
                <Link key={item.link} href={item.link} onClick={() => setOpenMenu(false)}>
                  <div className={cn(
                    "w-full p-4 rounded-xl flex items-center gap-4 font-bold transition-all",
                    isActive ? "bg-blue-50 text-[#2D3DFF]" : "text-gray-600 hover:bg-gray-50"
                  )}>
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
