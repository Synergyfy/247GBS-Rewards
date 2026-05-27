'use client';

import React, { useEffect, useState } from 'react';
import logo from '../../../public/campaign/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { IoCloseSharp } from 'react-icons/io5';
import { MdOutlineMenu } from 'react-icons/md';

const Navbar = () => {
  const { topTitle, topHeadline, primaryBg, primaryText } = useSelector(
    (state: RootState) => state.createCampaign
  );
  const [openMenu, setOpenMenu] = useState(false);

  const [campaignCode, setCampaignCode] = useState('');

  useEffect(() => {
    const code = localStorage.getItem('currentCampaign') || '';
    setCampaignCode(code);
  }, []);

  const navItems = [
    { name: 'Dashboard', link: `/staff/${campaignCode}` },
    { name: 'Points', link: '/staff/points' },
    { name: 'Reward', link: '/staff/reward' },
  ];

  const MobileMenu = () => {
    return (
      <div className="bg-gray-300 absolute top-0 w-full text-black px-2">
        <div className="flex justify-between items-center py-2">
          <span>
            <h1>{topTitle}</h1>
            <h3>{topHeadline}</h3>
          </span>

          <IoCloseSharp
            className="text-xl"
            onClick={() => setOpenMenu(false)}
          />
        </div>

        <ul className="flex flex-col text-black justify-start gap-4 md:gap-6 h-full mt-3 py-3">
          {navItems.map((item, i) => {
            return (
              <Link key={i} href={item.link}>
                <li className="h-full flex items-center justify-end px-2 hover:bg-[#1A1A1A]">
                  {item.name.toUpperCase()}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <nav
      className="flex px-1 md:px-0 justify-between md:justify-around font-medium  items-center h-[6rem] w-full "
      style={{ backgroundColor: primaryBg, color: primaryText }}
    >
      <div className="flex gap-4 items-center">
        <Image src={logo} alt="logo" className="w-[5rem]" />
        <span>
          <h1>{topTitle}</h1>
          <h3>{topHeadline}</h3>
        </span>
      </div>
      <div className="h-full hidden md:inline">
        <ul className="flex justify-around gap-4 md:gap-6 h-full">
          {navItems.map((item, i) => {
            return (
              <Link key={i} href={item.link}>
                <li className="h-full flex items-center justify-center px-2 hover:bg-[#1A1A1A]">
                  {item.name.toUpperCase()}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
      {!openMenu && (
        <MdOutlineMenu
          className="text-white text-xl md:hidden"
          onClick={() => setOpenMenu(true)}
        />
      )}
      {openMenu && <MobileMenu />}
    </nav>
  );
};

export default Navbar;
