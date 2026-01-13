'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { LogoutBtn } from './buttons/buttons';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
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

      <div className="flex items-center gap-4">
        <LogoutBtn />
      </div>
    </header>
  );
};

export default Header;
