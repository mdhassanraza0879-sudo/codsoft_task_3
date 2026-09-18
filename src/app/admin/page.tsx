"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import {
  ShieldCheck,
  Users,
  Briefcase,
  Building2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  UserCheck,
  UserX,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentUsers(data.recentUsers || []);
          setRecentJobs(data.recentJobs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              Administrative Governance Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Platform Master Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              System-wide metrics, account moderation, and compliance controls.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/users"
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm hover:border-indigo-300"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/jobs"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
            >
              Job Moderation
            </Link>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalUsers || 0}
            </div>
            <span className="text-[11px] text-slate-500">
              {stats?.totalCandidates} candidates • {stats?.totalRecruiters} recruiters
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Jobs</span>
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalJobs || 0}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">
              {stats?.activeJobs} active & published
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Companies</span>
              <Building2 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalCompanies || 0}
            </div>
            <span className="text-[11px] text-slate-500">Hiring organizations</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Applications</span>
              <FileText className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalApplications || 0}
            </div>
            <span className="text-[11px] text-slate-500">Platform submissions</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Health</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              100%
            </div>
            <span className="text-[11px] text-slate-500">All systems online</span>
          </div>
        </div>

        {/* RECENT USERS AND JOBS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* RECENT USERS */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent User Registrations
              </h3>
              <Link href="/admin/users" className="text-xs font-semibold text-indigo-600 hover:underline">
                View All Users
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentUsers.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={u.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        u.role === "ADMIN"
                          ? "bg-purple-50 text-purple-700"
                          : u.role === "RECRUITER"
                          ? "bg-indigo-50 text-indigo-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {u.role}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        u.isActive ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                      title={u.isActive ? "Active" : "Suspended"}
                    ></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT JOBS */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Latest Job Postings
              </h3>
              <Link href="/admin/jobs" className="text-xs font-semibold text-indigo-600 hover:underline">
                Moderation Table
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentJobs.map((j) => (
                <div key={j.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <Link
                      href={`/jobs/${j.id}`}
                      className="text-xs font-bold text-slate-900 dark:text-white hover:text-indigo-600 block line-clamp-1"
                    >
                      {j.title}
                    </Link>
                    <div className="text-[11px] text-slate-400">{j.company?.name}</div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs">
                    <span className="text-slate-500">{j._count?.applications || 0} applicants</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        j.status === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {j.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
