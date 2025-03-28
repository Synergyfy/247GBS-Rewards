'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { MdLogin } from 'react-icons/md';

export const LoginBtn = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/signin');
  };
  return (
    <Button
      variant="ghost"
      className="tracking-tight font-medium py-4 text-[1.08rem] h-[2.6rem]"
      onClick={handleClick}
    >
      <MdLogin />
      Login
    </Button>
  );
};

export const SignupBtn = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/signup');
  };
  return (
    <Button
      className="tracking-tight font-medium py-4 text-[1.08rem] h-[2.6rem]"
      onClick={handleClick}
    >
      Create an accounts
    </Button>
  );
};

export const HomepageToDashboard = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/loyalty-admin');
  };
  return (
    <Button
      className="tracking-tight font-medium py-4 text-[1.08rem] h-[2.6rem]"
      onClick={handleClick}
    >
      Go to Dashboard
    </Button>
  );
};
