'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import UserTable from '../../components/UserTable';
import EditProfileModal from '../../components/EditProfileModal';
import DeleteAccountModal from '../../components/DeleteAccountModal';
import { User, Mail, Calendar, Edit3, Trash2, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handleProfileUpdated = async () => {
    await refreshUser();
    setSuccessMessage('Profile successfully updated!');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Loading dashboard session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Success Toast */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your personal profile and view registered users in the database
          </p>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl font-extrabold uppercase shadow-md shadow-blue-500/20">
                {user.name ? user.name.slice(0, 2) : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Authenticated
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition"
              >
                <Edit3 className="w-4 h-4 text-slate-500" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-lg shadow-2xs transition"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-sm">
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <User className="w-3.5 h-3.5" />
                <span>User ID</span>
              </div>
              <p className="font-mono text-xs text-slate-700 truncate font-semibold">
                {user.id}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Mail className="w-3.5 h-3.5" />
                <span>Verified Email</span>
              </div>
              <p className="text-slate-800 font-medium truncate">
                {user.email}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Member Since</span>
              </div>
              <p className="text-slate-800 font-medium">
                {joinDate}
              </p>
            </div>
          </div>
        </div>

        {/* All Users Directory Table */}
        <UserTable />
      </main>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleProfileUpdated}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
