"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatSalary, getStatusBadge, getJobTypeLabel, getWorkplaceLabel } from "@/lib/utils";
import {
  Briefcase,
  FileText,
  Bookmark,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  User,
  ShieldCheck,
  Building2,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function CandidateDashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [appRes, jobsRes] = await Promise.all([
          fetch("/api/applications"),
          fetch("/api/jobs?limit=4"),
        ]);

        if (appRes.ok) {
          const appData = await appRes.json();
          setApplications(appData.applications || []);
        }

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setRecommendedJobs(jobsData.jobs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const inReviewCount = applications.filter(
    (a) => a.status === "UNDER_REVIEW" || a.status === "SHORTLISTED"
  ).length;
  const interviewCount = applications.filter((a) => a.status === "INTERVIEW").length;
  const hiredCount = applications.filter((a) => a.status === "HIRED").length;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* WELCOME BANNER */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Candidate Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Track your active job applications, review recruiter interview requests, and manage your technical profile.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1.5"
            >
              <User className="w-4 h-4" />
              Edit Profile
            </Link>
            <Link
              href="/jobs"
              className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4" />
              Explore Jobs
            </Link>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Applied</span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {applications.length}
            </div>
            <div className="text-[11px] text-slate-400">Total jobs applied</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">In Review</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-extrabold text-amber-600">
              {inReviewCount}
            </div>
            <div className="text-[11px] text-slate-400">Being evaluated by recruiters</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Interviews</span>
              <Calendar className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-extrabold text-indigo-600">
              {interviewCount}
            </div>
            <div className="text-[11px] text-slate-400">Active technical rounds</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Offers & Hired</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600">
              {hiredCount}
            </div>
            <div className="text-[11px] text-slate-400">Extended offers</div>
          </div>
        </div>

        {/* RECENT APPLICATIONS TABLE */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Applications
              </h2>
              <p className="text-xs text-slate-500">
                Track current status and feedback from hiring teams.
              </p>
            </div>
            <Link
              href="/applications"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View all ({applications.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">You haven&apos;t submitted any job applications yet.</p>
              <Link
                href="/jobs"
                className="inline-flex px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Browse open roles
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Company & Role</th>
                    <th className="pb-3">Date Applied</th>
                    <th className="pb-3">Pipeline Stage</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applications.slice(0, 5).map((app) => {
                    const badge = getStatusBadge(app.status);
                    return (
                      <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={app.job.company.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120"}
                              alt={app.job.company.name}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-50"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {app.job.title}
                              </div>
                              <div className="text-slate-500">{app.job.company.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-slate-500 font-medium">
                          {formatDate(app.createdAt)}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Link
                            href={`/jobs/${app.jobId}`}
                            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            View Job
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RECOMMENDED JOBS SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recommended for You
              </h2>
              <p className="text-xs text-slate-500">
                Matches based on current software engineering openings.
              </p>
            </div>
            <Link
              href="/jobs"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:shadow-sm transition-all flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500">{job.company?.name}</span>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 block line-clamp-1"
                  >
                    {job.title}
                  </Link>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/jobs/${job.id}`}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-colors shrink-0"
                >
                  Apply
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
