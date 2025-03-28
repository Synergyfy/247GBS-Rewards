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
    console.log('clicked', path);
    router.push(path);
  };

  return (
    <div
      className="border rounded-3xl h-[20rem] w-[23rem] flex flex-col items-center justify-center cursor-pointer bg-gray-100 hover:bg-blue-500 hover:shadow-md hover:scale-105 transition-all duration-300 ease-in-out px-2"
      onClick={handleClick}
    >
      <Image src={icon} width={300} height={300} alt="icon" loading="lazy" />
      <h3 className="font-medium text-3xl">{title}</h3>
      <p className="text-lg">{description}</p>
    </div>
  );
};

export default MenuCard;
