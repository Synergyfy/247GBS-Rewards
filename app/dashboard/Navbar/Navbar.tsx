"use client";

import React, { useState, useRef, useEffect } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";

const Navbar = ({ activeTab }: { activeTab: string }) => {
  const [isFlagDropdownOpen, setIsFlagDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const flagDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        flagDropdownRef.current &&
        !flagDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFlagDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white h-20 w-full shadow-md p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">{activeTab}</h1>
      <div className="flex items-center space-x-6">
        <button className="bg-white text-black px-2 py-2 rounded-full border border-[#000]">
          <IoNotificationsOutline className="w-6 h-6 text-gray-600 cursor-pointer" />
        </button>
        <button className="bg-white text-black px-4 py-2 rounded-lg border-2 border-[#000] shadow-md hover:bg-slate-300 transition-all">
          LIVE REVIEW
        </button>

        {/* Flag Dropdown */}
        <div className="relative" ref={flagDropdownRef}>
          <button
            onClick={() => setIsFlagDropdownOpen(!isFlagDropdownOpen)}
            className="bg-white p-2 flex items-center justify-center"
          >
            <Image
              src="https://flagcdn.com/w40/gb.png"
              alt="UK flag"
              width={24}
              height={16}
            />
          </button>
          {isFlagDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <ul className="py-2 text-sm text-gray-700">
                <li className="hover:bg-gray-100 px-4 py-2 flex items-center cursor-pointer">
                  <Image src="https://flagcdn.com/w40/gb.png" alt="UK flag" width={20} height={20} className="mr-2" />
                  United Kingdom
                </li>
                <li className="hover:bg-gray-100 px-4 py-2 flex items-center cursor-pointer">
                  <Image src="https://flagcdn.com/w40/us.png" alt="US flag" width={20} height={20} className="mr-2" />
                  United States
                </li>
                <li className="hover:bg-gray-100 px-4 py-2 flex items-center cursor-pointer">
                  <Image src="https://flagcdn.com/w40/fr.png" alt="France flag" width={20} height={20} className="mr-2" />
                  France
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <FaUserCircle
            className="w-8 h-8 text-gray-600 cursor-pointer"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          />
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <ul className="py-2 text-sm text-gray-700">
                <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-center">Log Out</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
