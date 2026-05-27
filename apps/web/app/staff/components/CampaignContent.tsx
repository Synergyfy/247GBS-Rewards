import React from 'react';

import placeholderImage from '@/public/campaign/logo.png';
import Image from 'next/image';

const CampaignContent = () => {
  const contents = [
    {
      image: placeholderImage,
      title: 'Popular Rewards',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea cobgmmodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore',
    },
    {
      image: placeholderImage,
      title: 'Popular Rewards',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea cobgmmodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore',
    },
    {
      image: placeholderImage,
      title: 'Popular Rewards',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea cobgmmodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore',
    },
  ];
  return (
    <section className="flex justify-center items-center bg-white gap-4 mt-10">
      {contents.map((content, i) => {
        const { image, title, description } = content;
        return (
          <div
            key={i}
            className="te w-[20rem] p-2 cursor-pointer flex flex-col gap-6"
          >
            <Image
              src={image}
              alt="placeholder"
              className="h-[10rem] w-[20rem] object-cover"
            />
            <h3 className="text-3xl font-medium">{title}</h3>
            <p className="text-sm overfl leading-relaxed break-words">
              {description}
            </p>
          </div>
        );
      })}
    </section>
  );
};

export default CampaignContent;
