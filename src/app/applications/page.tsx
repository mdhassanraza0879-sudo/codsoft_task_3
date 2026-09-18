"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatSalary, getStatusBadge } from "@/lib/utils";
import {
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  Building2,
  MapPin,
  Loader2,
  Briefcase,
} from "lucide-react";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const filteredApplications = applications.filter((app) => {
    if (activeTab === "ALL") return true;
    return app.status === activeTab;
  });

  const stages = [
    { key: "APPLIED", label: "Applied" },
    { key: "UNDER_REVIEW", label: "In Review" },
    { key: "SHORTLISTED", label: "Shortlisted" },
    { key: "INTERVIEW", label: "Interview" },
    { key: "HIRED", label: "Hired" },
    { key: "REJECTED", label: "Archived" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Job Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track real-time progress across all submitted engineering and design applications.
          </p>
        </div>

        {/* STATUS TABS */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "ALL"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            All ({applications.length})
          </button>
          {stages.map((st) => {
            const count = applications.filter((a) => a.status === st.key).length;
            return (
              <button
                key={st.key}
                onClick={() => setActiveTab(st.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === st.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                {st.label} ({count})
              </button>
            );
          })}
        </div>

        {/* APPLICATION CARDS LIST */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No applications in this category
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore verified roles and submit your resume to start tracking.
            </p>
            <Link
              href="/jobs"
              className="inline-flex px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Browse Open Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const badge = getStatusBadge(app.status);

              return (
                <div
                  key={app.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={app.job?.company?.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120"}
                        alt={app.job?.company?.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-50 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-500">
                          {app.job?.company?.name}
                        </div>
                        <Link
                          href={`/jobs/${app.jobId}`}
                          className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors block"
                        >
                          {app.job?.title}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {app.job?.location}
                          </span>
                          <span>•</span>
                          <span>Applied on {formatDate(app.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        Updated {formatDate(app.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* STAGE PROGRESS BAR */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
                      <span className={app.status !== "REJECTED" ? "text-indigo-600" : ""}>
                        1. Applied
                      </span>
                      <span
                        className={
                          ["UNDER_REVIEW", "SHORTLISTED", "INTERVIEW", "HIRED"].includes(app.status)
                            ? "text-indigo-600"
                            : ""
                        }
                      >
                        2. Under Review
                      </span>
                      <span
                        className={
                          ["INTERVIEW", "HIRED"].includes(app.status) ? "text-indigo-600" : ""
                        }
                      >
                        3. Interview Round
                      </span>
                      <span className={app.status === "HIRED" ? "text-emerald-600 font-bold" : ""}>
                        4. Final Decision
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          app.status === "HIRED"
                            ? "w-full bg-emerald-500"
                            : app.status === "INTERVIEW"
                            ? "w-3/4 bg-indigo-600"
                            : app.status === "SHORTLISTED"
                            ? "w-1/2 bg-purple-600"
                            : app.status === "UNDER_REVIEW"
                            ? "w-1/3 bg-amber-500"
                            : app.status === "REJECTED"
                            ? "w-full bg-slate-400"
                            : "w-1/6 bg-blue-500"
                        }`}
                      ></div>
                    </div>
                  </div>

                  {/* RECRUITER NOTES / FEEDBACK IF ANY */}
                  {app.notes && app.notes.length > 0 && (
                    <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Recruiter Feedback & Instructions</span>
                      </div>
                      {app.notes.map((n: any) => (
                        <p key={n.id} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-5 border-l-2 border-indigo-400">
                          {n.content}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* COVER LETTER PREVIEW */}
                  {app.coverLetter && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl">
                      <span className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                        Your Cover Note:
                      </span>
                      <p className="line-clamp-2 italic">&ldquo;{app.coverLetter}&rdquo;</p>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <Link
                      href={app.resumeUrl}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>View Submitted Resume</span>
                    </Link>

                    <Link
                      href={`/jobs/${app.jobId}`}
                      className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline"
                    >
                      <span>Job Description</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
