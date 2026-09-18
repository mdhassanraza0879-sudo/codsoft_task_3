"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatSalary, formatDate, getJobTypeLabel, getWorkplaceLabel } from "@/lib/utils";
import { Bookmark, MapPin, Building2, Trash2, ArrowRight, Loader2, Briefcase } from "lucide-react";

export default function SavedJobsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSavedJobs() {
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          // Filter saved jobs
          setSavedJobs(data.jobs.filter((j: any) => j.isSaved));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSavedJobs();
  }, []);

  const handleRemove = async (jobId: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    try {
      await fetch(`/api/jobs/${jobId}/save`, { method: "DELETE" });
      toast.info("Job removed from bookmarks");
    } catch {
      toast.error("Failed to remove saved job");
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Saved Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep track of open positions you plan to apply for.
          </p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No saved jobs yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the bookmark icon on any job card to save it for later review.
            </p>
            <Link
              href="/jobs"
              className="inline-flex px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={job.company?.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120"}
                        alt={job.company?.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-50"
                      />
                      <div>
                        <span className="text-xs font-medium text-slate-500">{job.company?.name}</span>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 block line-clamp-1"
                        >
                          {job.title}
                        </Link>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(job.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span>{getWorkplaceLabel(job.workplaceType)}</span>
                    <span>•</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {job.userApplication ? "Already Applied" : "Ready to apply"}
                  </span>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
