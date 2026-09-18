"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatDate, formatSalary } from "@/lib/utils";
import {
  Briefcase,
  PlusCircle,
  Eye,
  Users,
  Edit,
  Trash2,
  ExternalLink,
  Kanban,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function RecruiterJobsPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      const res = await fetch("/api/recruiter/dashboard");
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

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PUBLISHED" ? "CLOSED" : "PUBLISHED";
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Job marked as ${nextStatus.toLowerCase()}`);
        loadJobs();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleDeleteJob = async (jobId: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Job posting removed");
        loadJobs();
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch {
      toast.error("Network error deleting job");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Manage Job Listings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Active openings posted for {user?.recruiterProfile?.company?.name || "your organization"}.
            </p>
          </div>

          <Link
            href="/recruiter/jobs/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Position
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No active job listings</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t published any openings yet. Create your first listing to begin receiving candidate applications.
            </p>
            <Link
              href="/recruiter/jobs/new"
              className="inline-flex px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Post a Job
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950">
                    <th className="py-3.5 px-6">Role & Details</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-center">Applicants</th>
                    <th className="py-3.5 px-6">Date Created</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-6">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 block"
                        >
                          {job.title}
                        </Link>
                        <div className="text-slate-500 text-[11px] pt-0.5">
                          {job.location} • {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(job.id, job.status)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                            job.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              job.status === "PUBLISHED" ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          ></span>
                          {job.status} (Click to toggle)
                        </button>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <Link
                          href={`/recruiter/pipeline?jobId=${job.id}`}
                          className="inline-flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{job._count?.applications || 0}</span>
                        </Link>
                      </td>

                      <td className="py-4 px-6 text-slate-500">
                        {formatDate(job.createdAt)}
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <Link
                          href={`/recruiter/pipeline?jobId=${job.id}`}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 inline-block"
                          title="View Kanban Pipeline"
                        >
                          <Kanban className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white inline-block"
                          title="Public View"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 inline-block"
                          title="Delete Job"
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
