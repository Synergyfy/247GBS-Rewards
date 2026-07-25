'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-600 py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
              <span className="text-xl font-bold text-gray-900">247GBS Loyalty</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Your gateway to exclusive rewards and experiences. Join the community today.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Discover</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-purple-600 transition-colors">How it Works</Link></li>
              <li><Link href="#" className="hover:text-purple-600 transition-colors">Rewards Catalog</Link></li>
              <li><Link href="#" className="hover:text-purple-600 transition-colors">Partner Stores</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-purple-600 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-purple-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>support@247gbs.com</li>
              <li>1-800-247GBS</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} 247GBS Loyalty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
