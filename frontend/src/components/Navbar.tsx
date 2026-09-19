'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="font-semibold text-gray-900 text-base tracking-tight hover:text-gray-700">
          User Dashboard
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {user.name}
            </span>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md border border-gray-200 transition disabled:opacity-50"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
