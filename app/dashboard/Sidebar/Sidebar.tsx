'use client';

import { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import Link from 'next/link';

const mockdata = [
  {
    label: 'DASHBOARD',
    initiallyOpened: false,
    links: [
      { label: 'QR Code Scanner', link: '/' },
      { label: 'Customers Tab', link: '/' },
      { label: 'Admin only feature', link: '/' },
    ],
  },
  {
    label: 'ANALYTICS',
    initiallyOpened: false,
    links: [
      { label: 'Earning', link: '/' },
      { label: 'Spending', link: '/' },
      { label: 'QR Code Scan history', link: '/' },
    ],
  },
  {
    label: 'PROFILE MANAGEMENT',
    links: [
      { label: 'Your profile', link: '/' },
      { label: 'Businesses', link: '/' },
      { label: 'Staff', link: '/' },
      { label: 'National Membership', link: '/' },
      { label: 'Consumers', link: '/' },
      { label: 'Account Managers', link: '/' },
      { label: 'Agents', link: '/' },
      { label: 'Consultants', link: '/' },
      { label: 'Segment', link: '/' },
    ],
  },
  {
    label: 'MCOM BOTS SOLUTIONS AND PROGRAMMES',
    links: [
      { label: 'Mcom Perks', link: '/' },
      { label: 'QR Code', link: '/' },
      { label: 'Mcom Cards', link: '/' },
      { label: 'NFC Cardtap', link: '/' },
      { label: 'NFC Tags', link: '/' },
      { label: 'Mcom E Stores', link: '/' },
      { label: 'Nearby', link: '/' },
      { label: 'Rewards', link: '/' },
      { label: 'Campaign', link: '/' },
      { label: 'MCOM AI Bots', link: '/' },
      { label: 'Seasonal Marketing periods x4', link: '/' },
      { label: 'Excess Stock Audit', link: '/' },
      { label: 'Spare Capacity Audit', link: '/' },
      { label: 'Mcom Newsletter', link: '/' },
      { label: 'White Label Consortium', link: '/' },
      { label: 'Mcom Social Community', link: '/' },
    ],
  },
  {
    label: 'MCOM ACCESS & SETTINGS FOR',
    links: [
      { label: 'Mcom Points', link: '/' },
      { label: 'Mcom Credits', link: '/' },
      { label: 'Mcom Stamps', link: '/' },
      { label: 'Mcom Tokens', link: '/' },
      { label: 'Mcom White Label Pardner', link: '/' },
      { label: 'Mcom Exchange and Redeem', link: '/' },
    ],
  },
];

export function Sidebar({ onSelect }: { onSelect: (label: string) => void }) {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    () =>
      mockdata.reduce((acc, item) => {
        acc[item.label] = item.initiallyOpened || false;
        return acc;
      }, {} as { [key: string]: boolean })
  );

  const [activeLink, setActiveLink] = useState<string | null>(null);

  const toggleSection = (label: string) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleSelect = (label: string) => {
    setActiveLink(label);
    onSelect(label);
  };

  return (
    <nav className="w-64 h-screen bg-white border-r border-gray-200 p-4 shadow-md overflow-y-auto">
      <div className="text-left font-bold text-lg mb-4">
        <Link href="/landing" className="cursor-pointer">
          Home
        </Link>
      </div>
      <div className="mt-4">
        {mockdata.map(item => (
          <div key={item.label} className="mb-2 font-bold text-sm">
            <button
              onClick={() => toggleSection(item.label)}
              className="w-full flex items-center justify-between text-gray-800 hover:bg-gray-100 p-2 rounded-md transition-all"
            >
              <span className="mr-2">{item.label}</span>
              <IoMdArrowDropdown
                className={`transform transition-transform ${
                  openSections[item.label] ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
            {openSections[item.label] && (
              <ul className="ml-4 mt-2 space-y-2">
                {item.links.map(subLink => (
                  <li key={subLink.label}>
                    <button
                      onClick={() => handleSelect(subLink.label)}
                      className={`block font-medium p-2 px-8 transition duration-200 w-full text-left rounded-full ${
                        activeLink === subLink.label
                          ? 'bg-blue-500 text-white'
                          : 'text-black hover:bg-blue-500 hover:text-white'
                      }`}
                    >
                      {subLink.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
