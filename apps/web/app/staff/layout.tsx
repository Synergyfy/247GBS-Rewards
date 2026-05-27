import type { Metadata } from 'next';

import Navbar from './components/Navbar';

export const metadata: Metadata = {
  title: 'Staff Campaign page',
  description: 'This is the campaign page',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-dvh w-dvw flex flex-col overflow-hidden">
      <Navbar />
      <div className="w-screen bg-[#EEEEEE] overflow-y-auto h-[calc(100dvh-6rem)]">
        {children}
      </div>
    </div>
  );
}
