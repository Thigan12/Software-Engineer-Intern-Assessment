'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth, User } from '../context/AuthContext';

export default function UserTable() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Single user modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [fetchingSingle, setFetchingSingle] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<User[]>('/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleViewUser = async (id: string) => {
    setFetchingSingle(true);
    try {
      const data = await apiFetch<User>(`/users/${id}`);
      setSelectedUser(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user details');
    } finally {
      setFetchingSingle(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:px-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 text-base">Users</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
            {users.length}
          </span>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm border-b border-red-100">
          {error}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th scope="col" className="py-3 px-6">Name</th>
              <th scope="col" className="py-3 px-6">Email</th>
              <th scope="col" className="py-3 px-6">Joined</th>
              <th scope="col" className="py-3 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                  No users registered yet
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isCurrent = currentUser && (u.id === currentUser.id || u.email === currentUser.email);
                const joinDate = u.createdAt
                  ? new Date(u.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Recently';

                return (
                  <tr key={u.id} className={isCurrent ? 'bg-blue-50/40' : 'hover:bg-gray-50'}>
                    <td className="py-3 px-6 font-medium text-gray-900">
                      <span>{u.name}</span>
                      {isCurrent && (
                        <span className="ml-2 text-xs font-normal text-blue-600">
                          (You)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-gray-700">{u.email}</td>
                    <td className="py-3 px-6 text-gray-500 text-xs">{joinDate}</td>
                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={() => handleViewUser(u.id)}
                        disabled={fetchingSingle}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* View Single User Modal (GET /users/:id) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">User Profile</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-medium"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider block">Full Name</span>
                <span className="font-medium text-gray-900 text-base">{selectedUser.name}</span>
              </div>

              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider block">Email</span>
                <span className="text-gray-700">{selectedUser.email}</span>
              </div>

              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider block">Member Since</span>
                <span className="text-gray-700">
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Recently'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
