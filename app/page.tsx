'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/landing');
  }, [router]);

  return <div>Redirecting...</div>;
};

export default Page;
