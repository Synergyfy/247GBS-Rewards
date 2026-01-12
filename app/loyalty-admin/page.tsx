'use client';

import React from 'react';
import MenuCard from './components/cards/MenuCard';
import businessIcon from '@/public/loyalty/Icons/businessIcon.png';
import staffIcon from '@/public/loyalty/Icons/staffIcon.png';
import rewardIcon from '@/public/loyalty/Icons/rewardIcon.png';
import campaignIcon from '@/public/loyalty/Icons/campaignIcon.png';

const menuItems = [
  {
    title: 'Business',
    description: 'Manage your business settings',
    path: '/loyalty-admin/business',
    icon: businessIcon,
  },
  {
    title: 'Staff',
    description: 'Manage your staffs',
    path: '/loyalty-admin/staff',
    icon: staffIcon,
  },
  {
    title: 'Reward',
    description: 'Manage your reward settings',
    path: '/loyalty-admin/rewards',
    icon: rewardIcon,
  },
  {
    title: 'Campaign',
    description: 'Manage your campaign settings',
    path: '/loyalty-admin/campaign',
    icon: campaignIcon,
  },
];

const Page = () => {
  return (
    <div className="py-10">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
        {menuItems.map((item, i) => {
          return (
            <MenuCard
              key={i}
              title={item.title}
              description={item.description}
              path={item.path}
              icon={item.icon}
            />
          );
        })}
      </section>
    </div>
  );
};

export default Page;
