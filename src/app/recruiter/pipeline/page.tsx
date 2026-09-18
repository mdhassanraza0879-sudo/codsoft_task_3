"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatDate } from "@/lib/utils";
import {
  Kanban,
  User,
  FileText,
  MessageSquare,
  ChevronDown,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  XCircle,
  ExternalLink,
  Plus,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function PipelinePage() {
  const { user } = useAuth();
  const toast = useToast();

  const [pipeline, setPipeline] = useState<any>({
    APPLIED: [],
    UNDER_REVIEW: [],
    SHORTLISTED: [],
    INTERVIEW: [],
    REJECTED: [],
    HIRED: [],
  });
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter by Job
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");

  // Recruiter Note Modal State
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [noteContent, setNoteContent] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  // Status Change State
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);

  const loadPipeline = async (jobId = "") => {
    setLoading(true);
    try {
      const url = jobId ? `/api/recruiter/pipeline?jobId=${jobId}` : "/api/recruiter/pipeline";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPipeline(data.pipeline);
        setTotalCandidates(data.totalCandidates);
      }
    } catch {
      toast.error("Failed to load candidate pipeline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadJobsList() {
      try {
        const res = await fetch("/api/recruiter/dashboard");
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadJobsList();
    loadPipeline();
  }, []);

  const handleJobFilterChange = (jobId: string) => {
    setSelectedJobId(jobId);
    loadPipeline(jobId);
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    setUpdatingAppId(applicationId);
    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      setUpdatingAppId(null);

      if (res.ok && data.success) {
        toast.success(data.message);
        loadPipeline(selectedJobId);
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch {
      setUpdatingAppId(null);
      toast.error("Network error updating status");
    }
  };

  const handleOpenNoteModal = (app: any) => {
    setSelectedApp(app);
    setNoteContent("");
    setNoteModalOpen(true);
  };

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim() || !selectedApp) return;

    setSubmittingNote(true);
    try {
      const res = await fetch(`/api/applications/${selectedApp.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent.trim() }),
      });
      const data = await res.json();
      setSubmittingNote(false);

      if (res.ok && data.success) {
        toast.success("Recruiter evaluation note attached!");
        setNoteModalOpen(false);
        loadPipeline(selectedJobId);
      } else {
        toast.error(data.message || "Failed to add note");
      }
    } catch {
      setSubmittingNote(false);
      toast.error("Network error submitting note");
    }
  };

  const columns = [
    {
      key: "APPLIED",
      label: "Applied",
      border: "border-t-blue-500",
      badge: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
      icon: Clock,
    },
    {
      key: "UNDER_REVIEW",
      label: "Under Review",
      border: "border-t-amber-500",
      badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
      icon: Clock,
    },
    {
      key: "SHORTLISTED",
      label: "Shortlisted",
      border: "border-t-purple-500",
      badge: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
      icon: CheckCircle2,
    },
    {
      key: "INTERVIEW",
      label: "Interview",
      border: "border-t-indigo-500",
      badge: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
      icon: Calendar,
    },
    {
      key: "HIRED",
      label: "Hired",
      border: "border-t-emerald-500",
      badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
      icon: CheckCircle2,
    },
    {
      key: "REJECTED",
      label: "Rejected",
      border: "border-t-rose-500",
      badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
      icon: XCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* HEADER & FILTERS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <Kanban className="w-3.5 h-3.5" />
              Applicant Tracking System (ATS)
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recruitment Pipeline
            </h1>
            <p className="text-xs text-slate-500">
              Manage candidate stages, advance evaluations, and record interview feedback.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400">Target Role:</span>
            <select
              value={selectedJobId}
              onChange={(e) => handleJobFilterChange(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              id="pipeline-job-filter"
            >
              <option value="">All Active Openings ({totalCandidates} candidates)</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j._count?.applications || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          /* KANBAN BOARD HORIZONTAL SCROLL CONTAINER */
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-6">
            {columns.map((col) => {
              const items = pipeline[col.key] || [];
              const Icon = col.icon;

              return (
                <div
                  key={col.key}
                  className={`bg-slate-100/70 dark:bg-slate-900/60 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 border-t-4 ${col.border} flex flex-col min-h-[680px] shadow-sm`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {col.label}
                      </span>
                    </div>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${col.badge}`}>
                      {items.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                    {items.length === 0 ? (
                      <div className="h-32 flex items-center justify-center text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                        No candidates in this stage
                      </div>
                    ) : (
                      items.map((app: any) => {
                        const isUpdating = updatingAppId === app.id;

                        return (
                          <div
                            key={app.id}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all space-y-3 relative group"
                          >
                            {isUpdating && (
                              <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xs rounded-2xl flex items-center justify-center z-10">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                              </div>
                            )}

                            {/* Candidate Header */}
                            <div className="flex items-start gap-2.5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={app.user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Candidate"}
                                alt={app.user?.name}
                                className="w-8 h-8 rounded-full object-cover shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {app.user?.name}
                                </h4>
                                <p className="text-[10px] text-slate-400 truncate">
                                  {app.user?.candidateProfile?.headline || "Software Candidate"}
                                </p>
                              </div>
                            </div>

                            {/* Role Applied For */}
                            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50/60 dark:bg-indigo-950/40 px-2 py-1 rounded-lg truncate">
                              {app.job?.title}
                            </div>

                            {/* Skills preview */}
                            {app.user?.candidateProfile?.skills && (
                              <div className="flex flex-wrap gap-1">
                                {app.user.candidateProfile.skills.slice(0, 2).map((sk: string) => (
                                  <span
                                    key={sk}
                                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                  >
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Recruiter Notes preview if present */}
                            {app.notes && app.notes.length > 0 && (
                              <div className="text-[10px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-1">
                                <span className="font-semibold text-indigo-600 flex items-center gap-1">
                                  <MessageSquare className="w-2.5 h-2.5" /> Note
                                </span>
                                <p className="line-clamp-2 italic">{app.notes[0].content}</p>
                              </div>
                            )}

                            {/* Card Footer Actions */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
                              <Link
                                href={app.resumeUrl}
                                target="_blank"
                                className="text-slate-400 hover:text-indigo-600 flex items-center gap-1"
                                title="View Resume"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>CV</span>
                              </Link>

                              <button
                                onClick={() => handleOpenNoteModal(app)}
                                className="text-slate-400 hover:text-indigo-600 flex items-center gap-1"
                                title="Add Feedback Note"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Add Note</span>
                              </button>
                            </div>

                            {/* STAGE SELECTOR DROPDOWN */}
                            <div className="pt-1">
                              <label className="text-[9px] font-semibold text-slate-400 block mb-0.5 uppercase tracking-wider">
                                Advance Stage:
                              </label>
                              <select
                                value={app.status}
                                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                              >
                                <option value="APPLIED">1. Applied</option>
                                <option value="UNDER_REVIEW">2. Under Review</option>
                                <option value="SHORTLISTED">3. Shortlisted</option>
                                <option value="INTERVIEW">4. Interview</option>
                                <option value="HIRED">5. Hired</option>
                                <option value="REJECTED">6. Rejected</option>
                              </select>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RECRUITER NOTE MODAL */}
      {noteModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add Evaluation Note
                </h3>
                <p className="text-xs text-slate-500">
                  Candidate: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedApp.user?.name}</span>
                </p>
              </div>
              <button
                onClick={() => setNoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNote} className="space-y-4">
              <textarea
                rows={4}
                required
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Document interview questions, candidate strengths, compensation expectations, or next steps..."
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white resize-none"
                id="recruiter-note-textarea"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingNote}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
                  id="submit-note-btn"
                >
                  {submittingNote ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Note</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
