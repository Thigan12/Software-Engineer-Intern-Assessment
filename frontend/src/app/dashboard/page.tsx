'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import UserTable from '../../components/UserTable';
import EditProfileModal from '../../components/EditProfileModal';
import DeleteAccountModal from '../../components/DeleteAccountModal';

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
    setSuccessMessage('Profile updated successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
            {successMessage}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-3.5 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition"
              >
                Edit Profile
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-3.5 py-1.5 text-sm font-medium text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-md transition"
              >
                Delete Account
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm">
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-0.5">
                Email
              </span>
              <span className="text-gray-900 font-medium">{user.email}</span>
            </div>

            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-0.5">
                Member Since
              </span>
              <span className="text-gray-900 font-medium">{joinDate}</span>
            </div>
          </div>
        </div>

        {/* User Directory Table */}
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
