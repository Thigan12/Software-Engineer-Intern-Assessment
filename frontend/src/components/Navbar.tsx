'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-lg text-slate-900 hover:opacity-90 transition">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <span>User<span className="text-blue-600">Portal</span></span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-sm">
              <div className="w-6 h-6 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center font-semibold text-xs">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-slate-700">{user.name}</span>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
