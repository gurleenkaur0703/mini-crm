'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="bg-blue-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-700 hover:text-blue-900 transition"
        >
          Mini CRM
        </Link>

        <nav className="flex items-center gap-6 text-md font-medium">
          <Link
            href="/dashboard"
            className="text-blue-700 hover:text-blue-900 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/customers"
            className="text-blue-700 hover:text-blue-900 transition"
          >
            Customers
          </Link>
          <Link
            href="/orders"
            className="text-blue-700 hover:text-blue-900 transition"
          >
            Orders
          </Link>
          <Link
            href="/segments"
            className="text-blue-700 hover:text-blue-900 transition"
          >
            Segments
          </Link>
          <Link
            href="/campaigns"
            className="text-blue-700 hover:text-blue-900 transition"
          >
            Campaigns
          </Link>

          {session?.user ? (
            <button
              onClick={() => signOut()}
              className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
