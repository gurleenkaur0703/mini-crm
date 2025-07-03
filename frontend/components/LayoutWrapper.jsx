// components/LayoutWrapper.jsx
'use client';

import { SessionProvider } from 'next-auth/react';
import Navbar from './Navbar';

// ...existing code...
export default function LayoutWrapper({ children }) {
  return (
    <SessionProvider>
      <Navbar />
      <main className="max-w-7xl mx-auto p-3 sm:p-6 w-full">{children}</main>
    </SessionProvider>
  );
}
// ...existing code...
