'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-blue-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-700 hover:text-blue-900 transition"
        >
          Mini CRM
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="sm:hidden flex items-center px-2 py-1 rounded text-blue-700 focus:outline-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-md font-medium">
          <Link href="/dashboard" className="text-blue-700 hover:text-blue-900 transition">
            Dashboard
          </Link>
          <Link href="/customers" className="text-blue-700 hover:text-blue-900 transition">
            Customers
          </Link>
          <Link href="/orders" className="text-blue-700 hover:text-blue-900 transition">
            Orders
          </Link>
          <Link href="/segments" className="text-blue-700 hover:text-blue-900 transition">
            Segments
          </Link>
          <Link href="/campaigns" className="text-blue-700 hover:text-blue-900 transition">
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

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="absolute top-full left-0 w-full bg-blue-50 border-t border-blue-200 flex flex-col gap-2 px-4 py-4 sm:hidden shadow z-50 animate-fade-in">
            <Link href="/dashboard" className="py-2 text-blue-700 hover:text-blue-900 transition" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
            <Link href="/customers" className="py-2 text-blue-700 hover:text-blue-900 transition" onClick={() => setMenuOpen(false)}>
              Customers
            </Link>
            <Link href="/orders" className="py-2 text-blue-700 hover:text-blue-900 transition" onClick={() => setMenuOpen(false)}>
              Orders
            </Link>
            <Link href="/segments" className="py-2 text-blue-700 hover:text-blue-900 transition" onClick={() => setMenuOpen(false)}>
              Segments
            </Link>
            <Link href="/campaigns" className="py-2 text-blue-700 hover:text-blue-900 transition" onClick={() => setMenuOpen(false)}>
              Campaigns
            </Link>
            {session?.user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut();
                }}
                className="bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 transition text-left"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signIn('google');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-left"
              >
                Login
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}