"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatSalary, getStatusBadge } from "@/lib/utils";
import {
  Briefcase,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  PlusCircle,
  Kanban,
  Building2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Eye,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/recruiter/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentApplications(data.recentApplications || []);
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
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
        {/* HEADER & QUICK ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Recruiter Operations Suite
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {user?.recruiterProfile?.company?.name || "Talent Portal"} Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage hiring pipelines, review candidate submissions, and publish new openings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/recruiter/pipeline"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm hover:border-indigo-300 transition-colors flex items-center gap-2"
            >
              <Kanban className="w-4 h-4 text-indigo-600" />
              Kanban Board
            </Link>
            <Link
              href="/recruiter/jobs/new"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
              id="create-job-button"
            >
              <PlusCircle className="w-4 h-4" />
              Post New Job
            </Link>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Jobs</span>
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.activeJobs || 0}
            </div>
            <span className="text-[11px] text-slate-500">Live listings</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Applications</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalApplications || 0}
            </div>
            <span className="text-[11px] text-slate-500">Total received</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">In Review</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
              {stats?.inReview || 0}
            </div>
            <span className="text-[11px] text-slate-500">Pending screening</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Interviews</span>
              <Calendar className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
              {stats?.interviews || 0}
            </div>
            <span className="text-[11px] text-slate-500">Active rounds</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Hires</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {stats?.hires || 0}
            </div>
            <span className="text-[11px] text-slate-500">Accepted offers</span>
          </div>
        </div>

        {/* MAIN BODY: RECENT APPLICANTS STREAM + ACTIVE JOBS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* RECENT APPLICANTS */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Recent Candidate Submissions
                </h2>
                <p className="text-xs text-slate-500">
                  Direct applicants waiting for pipeline review.
                </p>
              </div>
              <Link
                href="/recruiter/pipeline"
                className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>Full Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentApplications.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500">
                No candidate submissions yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentApplications.map((app) => {
                  const badge = getStatusBadge(app.status);
                  return (
                    <div
                      key={app.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={app.user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Candidate"}
                          alt={app.user?.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                        />
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white">
                            {app.user?.name}
                          </div>
                          <div className="text-xs text-indigo-600 dark:text-indigo-400">
                            Applied for: <span className="font-medium text-slate-700 dark:text-slate-300">{app.job?.title}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {formatDate(app.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                        <Link
                          href="/recruiter/pipeline"
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                        >
                          Review in Pipeline
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ACTIVE JOBS QUICK WIDGET */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Company Postings
              </h3>
              <Link
                href="/recruiter/jobs"
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Manage All
              </Link>
            </div>

            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-colors space-y-1.5"
                >
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-xs font-bold text-slate-900 dark:text-white hover:text-indigo-600 block line-clamp-1"
                  >
                    {job.title}
                  </Link>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{job._count?.applications || 0} applicants</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 text-[10px] font-bold">
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/recruiter/jobs/new"
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:border-indigo-400 hover:text-indigo-600 flex items-center justify-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Create Another Role
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
