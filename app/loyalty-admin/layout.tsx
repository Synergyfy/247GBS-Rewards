'use client';

import { Inter } from 'next/font/google';
import NavBar from './components/NavBar';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --font-inter: ${inter.variable};
          }
        `}</style>
        <body className={`${inter.variable} antialiased`}>
          <div className="w-screen h-screen overflow-x-hidden overflow-y-auto">
            <NavBar />
            {children}
          </div>
        </body>
      </head>
      {/* ✅ Moved outside */}
    </html>
  );
}
