// components/LayoutWrapper.jsx
'use client';

import { SessionProvider } from 'next-auth/react';
import Navbar from './Navbar';

export default function LayoutWrapper({ children }) {
  return (
    <SessionProvider>
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </SessionProvider>
  );
}
