"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  ChevronLeft,
  Loader2,
} from "lucide-react";

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.set("role", roleFilter);
      if (searchQuery) params.set("q", searchQuery);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`User ${!currentStatus ? "activated" : "suspended"}`);
        loadUsers();
      } else {
        toast.error(data.message || "Failed to update user");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete account for ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("User permanently deleted");
        loadUsers();
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch {
      toast.error("Network error deleting user");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Admin Overview</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              User Directory & Permissions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Audit registered accounts, update access levels, or suspend non-compliant users.
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadUsers();
            }}
            className="flex-1 w-full flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by user name or email..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
            <span className="text-slate-400">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
            >
              <option value="">All Roles</option>
              <option value="CANDIDATE">Candidates Only</option>
              <option value="RECRUITER">Recruiters Only</option>
              <option value="ADMIN">Admins Only</option>
            </select>
          </div>
        </div>

        {/* USERS TABLE */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950">
                    <th className="py-3.5 px-6">User</th>
                    <th className="py-3.5 px-6">Role</th>
                    <th className="py-3.5 px-6">Account Status</th>
                    <th className="py-3.5 px-6">Joined Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={u.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                            <div className="text-slate-500 text-[11px]">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            u.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                              : u.role === "RECRUITER"
                              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleActive(u.id, u.isActive)}
                          disabled={u.id === currentAdmin?.id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                            u.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.isActive ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          ></span>
                          <span>{u.isActive ? "Active" : "Suspended"}</span>
                        </button>
                      </td>

                      <td className="py-4 px-6 text-slate-500">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {u.id !== currentAdmin?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
