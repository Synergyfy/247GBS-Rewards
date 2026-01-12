import React from 'react';
import { LogoutBtn } from './buttons/buttons';

const NavBar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Loyalty Program
            </span>
          </div>
          <div className="flex items-center">
            <LogoutBtn />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
