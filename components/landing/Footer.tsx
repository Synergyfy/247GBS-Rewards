'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
              <span className="text-xl font-bold text-white">LoyaltyPro</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Building stronger relationships between businesses and customers through innovative loyalty solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Enterprise</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Legal</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} LoyaltyPro. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
