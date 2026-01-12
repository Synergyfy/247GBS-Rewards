'use client';

import Image, { StaticImageData } from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';

interface MenuCardProps {
  icon: StaticImageData;
  title: string;
  description: string;
  path: string;
}

const MenuCard: React.FC<MenuCardProps> = ({
  icon,
  title,
  description,
  path,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(path);
  };

  return (
    <div
      className="group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer shadow-sm hover:shadow-lg hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 h-full"
      onClick={handleClick}
    >
      <div className="mb-4 relative w-24 h-24 sm:w-32 sm:h-32 transition-transform duration-300 group-hover:scale-110">
        <Image
          src={icon}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'contain' }}
          loading="lazy"
        />
      </div>
      <h3 className="font-bold text-xl sm:text-2xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 text-sm sm:text-base">
        {description}
      </p>
    </div>
  );
};

export default MenuCard;
