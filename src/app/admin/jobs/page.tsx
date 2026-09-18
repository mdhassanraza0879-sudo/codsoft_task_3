"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { formatDate, formatSalary } from "@/lib/utils";
import {
  Briefcase,
  ShieldCheck,
  Trash2,
  ExternalLink,
  ChevronLeft,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function AdminJobsPage() {
  const toast = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleUpdateStatus = async (jobId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        loadJobs();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleDeleteJob = async (jobId: string, title: string) => {
    if (!confirm(`Permanently remove listing "${title}" from platform?`)) return;

    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Job posting permanently removed");
        loadJobs();
      } else {
        toast.error("Failed to delete job");
      }
    } catch {
      toast.error("Network error");
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

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Job Posting Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review live and archived job openings across all companies to ensure compliance and quality.
          </p>
        </div>

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
                    <th className="py-3.5 px-6">Job Title & Company</th>
                    <th className="py-3.5 px-6">Recruiter</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Date Posted</th>
                    <th className="py-3.5 px-6 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-6">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 block line-clamp-1"
                        >
                          {job.title}
                        </Link>
                        <span className="text-slate-500 text-[11px]">
                          {job.company?.name} • {job.location}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                        <div className="font-semibold">{job.recruiter?.name}</div>
                        <div className="text-[10px] text-slate-400">{job.recruiter?.email}</div>
                      </td>

                      <td className="py-4 px-6">
                        <select
                          value={job.status}
                          onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none"
                        >
                          <option value="PUBLISHED">Published</option>
                          <option value="CLOSED">Closed / Inactive</option>
                          <option value="DRAFT">Draft</option>
                        </select>
                      </td>

                      <td className="py-4 px-6 text-slate-500">
                        {formatDate(job.createdAt)}
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <Link
                          href={`/jobs/${job.id}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white inline-block"
                          title="View on site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 inline-block"
                          title="Remove listing permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
