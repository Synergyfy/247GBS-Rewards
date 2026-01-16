'use client';

import './globals.css';
import QueryProvider from '@/services/Provider';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { Toaster } from '@/components/ui/sonner';

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
            --font-inter: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
        `}</style>
      </head>
      <body className="antialiased" style={{ fontFamily: 'var(--font-inter)' }}>
        <Provider store={store}>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </Provider>
      </body>
    </html>
  );
}
