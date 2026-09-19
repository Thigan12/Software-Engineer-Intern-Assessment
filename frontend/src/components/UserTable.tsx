'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth, User } from '../context/AuthContext';
import { Search, RefreshCw, Users, Mail, Calendar, UserCheck } from 'lucide-react';

export default function UserTable() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<User[]>('/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load user directory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Registered Users Directory</h3>
            <p className="text-xs text-slate-500">
              {users.length} {users.length === 1 ? 'user' : 'users'} registered in MongoDB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            title="Refresh user list"
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm border-b border-red-100">
          {error}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 tracking-wider border-b border-slate-200">
            <tr>
              <th scope="col" className="py-3 px-5">User</th>
              <th scope="col" className="py-3 px-5">Email Address</th>
              <th scope="col" className="py-3 px-5">Joined Date</th>
              <th scope="col" className="py-3 px-5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                    <span>Loading users from database...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-slate-400">
                  {search ? `No users match "${search}"` : 'No users registered yet'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const isCurrent = currentUser && (u.id === currentUser.id || u.email === currentUser.email);
                const joinDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }) : 'Recently';

                return (
                  <tr key={u.id} className={`hover:bg-slate-50/60 transition ${isCurrent ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                          {u.name ? u.name.slice(0, 2) : 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-2">
                            <span>{u.name}</span>
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                <UserCheck className="w-3 h-3" />
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 font-mono">ID: {u.id?.slice(-8) || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{joinDate}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
