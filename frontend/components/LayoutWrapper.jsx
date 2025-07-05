'use client';

import { SessionProvider } from 'next-auth/react';
import Navbar from './Navbar';

export default function LayoutWrapper({ children }) {
  return (
    <SessionProvider>
      <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto p-3 sm:p-6 w-full">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
