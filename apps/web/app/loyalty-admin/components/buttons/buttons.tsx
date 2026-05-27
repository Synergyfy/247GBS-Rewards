'use client';

import { Button } from '@/components/ui/button';
import { deleteCookie } from '@/services/deleteCookie';
import { useRouter } from 'next/navigation';
import { TbLogout2 } from 'react-icons/tb';

export const LogoutBtn = () => {
  const router = useRouter();

  const handleClick = () => {
    deleteCookie('token');
    localStorage.removeItem('username');
    router.push('/signin');
  };

  return (
    <Button
      className="tracking-tight font-medium py-4 text-[1.08rem] h-[2.6rem]"
      onClick={handleClick}
    >
      <TbLogout2 />
      Log out
    </Button>
  );
};
