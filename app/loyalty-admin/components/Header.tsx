'use client';

import React from 'react';
import { Menu, HelpCircle } from 'lucide-react';
import { LogoutBtn } from './buttons/buttons';
import { useTour } from './tour/tour-context';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { startTour, hasCompletedTour } = useTour();

  return (
    <header
      data-tour-id="header"
      className="sticky top-0 z-10 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm"
    >
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-500 rounded-md lg:hidden hover:text-gray-900 hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          data-tour-id="help-button"
          onClick={startTour}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
          title="Start guided tour"
        >
          <HelpCircle size={18} />
          <span className="hidden sm:inline">{hasCompletedTour ? 'Restart Tour' : 'Help'}</span>
        </button>
        <LogoutBtn />
      </div>
    </header>
  );
};

export default Header;

