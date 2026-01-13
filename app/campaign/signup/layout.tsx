import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campaign page signup',
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
