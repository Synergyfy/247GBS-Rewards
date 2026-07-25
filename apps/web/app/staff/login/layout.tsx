import type { Metadata } from 'next';
import '../components/login.css';

export const metadata: Metadata = {
  title: 'Campaign page Login',
  description: 'This is the campaign page',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-dvh w-dvw flex flex-col overflow-hidden">{children}</div>
  );
}
