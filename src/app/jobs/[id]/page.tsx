"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatSalary, formatDate, getJobTypeLabel, getWorkplaceLabel, getExperienceLabel } from "@/lib/utils";
import {
  MapPin,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  ShieldCheck,
  Bookmark,
  Share2,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  ArrowRight,
  Loader2,
  ExternalLink,
  Briefcase,
  Award,
} from "lucide-react";

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Application Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    async function loadJob() {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data.job);
          setIsSaved(data.job.isSaved);
          if (data.job.userApplication) {
            setHasApplied(true);
          }
        } else {
          toast.error("Job posting not found");
          router.push("/jobs");
        }
      } catch {
        toast.error("Error loading job details");
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [id, router, toast]);

  const handleToggleSave = async () => {
    if (!user) {
      toast.error("Please sign in to bookmark jobs");
      router.push(`/login?redirect=/jobs/${id}`);
      return;
    }

    const nextState = !isSaved;
    setIsSaved(nextState);

    try {
      if (nextState) {
        await fetch(`/api/jobs/${id}/save`, { method: "POST" });
        toast.success("Job saved to your bookmarks");
      } else {
        await fetch(`/api/jobs/${id}/save`, { method: "DELETE" });
        toast.info("Job removed from bookmarks");
      }
    } catch {
      setIsSaved(!nextState);
      toast.error("Failed to update bookmark status");
    }
  };

  const handleOpenApplyModal = () => {
    if (!user) {
      toast.error("Please sign in to submit an application");
      router.push(`/login?redirect=/jobs/${id}`);
      return;
    }

    if (user.role === "RECRUITER") {
      toast.error("Recruiter accounts cannot apply to job postings. Switch to candidate mode.");
      return;
    }

    // Prefill candidate's existing resume if present
    if (user.candidateProfile?.resumeUrl) {
      setResumeUrl(user.candidateProfile.resumeUrl);
    }

    setApplyModalOpen(true);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/jobs/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeUrl: resumeUrl || "/uploads/resumes/demo-resume.pdf",
          coverLetter,
        }),
      });

      const data = await res.json();
      setSubmitting(false);

      if (res.ok && data.success) {
        setAppliedSuccess(true);
        setHasApplied(true);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch {
      setSubmitting(false);
      toast.error("Network error while submitting application");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to all open positions</span>
        </Link>

        {/* HERO CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={job.company?.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120"}
                alt={job.company?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-50 shrink-0"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {job.company?.name}
                  </span>
                  {job.company?.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Employer
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 pt-1">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span>{getWorkplaceLabel(job.workplaceType)}</span>
                  <span>•</span>
                  <span>{getJobTypeLabel(job.jobType)}</span>
                  <span>•</span>
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={handleToggleSave}
                  className={`p-3 rounded-xl border transition-colors flex items-center justify-center ${
                    isSaved
                      ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900"
                  }`}
                  title={isSaved ? "Saved" : "Save Job"}
                  id="save-job-btn"
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                </button>

                {hasApplied ? (
                  <div className="px-6 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Applied
                  </div>
                ) : (
                  <button
                    onClick={handleOpenApplyModal}
                    className="flex-1 md:flex-initial px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all"
                    id="apply-now-btn"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* KEY DETAILS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[11px] text-slate-400 block mb-0.5">Experience</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {getExperienceLabel(job.experienceLevel)}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[11px] text-slate-400 block mb-0.5">Workplace</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {getWorkplaceLabel(job.workplaceType)}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[11px] text-slate-400 block mb-0.5">Job Type</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {getJobTypeLabel(job.jobType)}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[11px] text-slate-400 block mb-0.5">Total Applicants</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {job._count?.applications || 0} Candidates
              </span>
            </div>
          </div>
        </div>

        {/* MAIN BODY: DESCRIPTION + COMPANY OVERVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT: JOB DETAILS */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Role Overview</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Responsibilities</h2>
                <ul className="space-y-2.5">
                  {job.responsibilities.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Qualifications & Requirements</h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Perks & Benefits</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((benefit: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2.5"
                    >
                      <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Required Technical Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs border border-slate-200/60 dark:border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: COMPANY OVERVIEW SIDEBAR */}
          <aside className="lg:col-span-1 space-y-6 sticky top-24">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">About the Employer</h3>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={job.company?.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120"}
                  alt={job.company?.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-50"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{job.company?.name}</h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{job.company?.industry}</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {job.company?.about || "Pioneering technology leader hiring premier talent."}
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                {job.company?.size && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Company Size:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{job.company.size}</span>
                  </div>
                )}
                {job.company?.location && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Headquarters:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{job.company.location}</span>
                  </div>
                )}
                {job.company?.website && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Official Website:</span>
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom CTA Card */}
            <div className="p-6 rounded-3xl bg-indigo-600 text-white space-y-4 text-center">
              <h4 className="text-base font-bold">Ready to take the next step?</h4>
              <p className="text-xs text-indigo-100">
                Join a dynamic squad building the future of software infrastructure.
              </p>
              {hasApplied ? (
                <div className="w-full py-2.5 rounded-xl bg-white/20 text-white text-xs font-bold">
                  ✓ Application Submitted
                </div>
              ) : (
                <button
                  onClick={handleOpenApplyModal}
                  className="w-full py-3 rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-xs shadow-md transition-colors"
                >
                  Submit Application
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* APPLICATION MODAL */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative"
            id="apply-modal"
          >
            {appliedSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Application Submitted!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Your profile, resume, and cover note have been routed directly into the recruiter&apos;s active Kanban pipeline.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setApplyModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
                  >
                    Close
                  </button>
                  <Link
                    href="/applications"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
                  >
                    View in Application Tracker
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Apply to {job.company?.name}
                    </h3>
                    <p className="text-xs text-slate-500">{job.title}</p>
                  </div>
                  <button
                    onClick={() => setApplyModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4">
                  {/* Candidate info summary */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Candidate"}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">{user?.name}</div>
                      <div className="text-slate-500">{user?.email}</div>
                    </div>
                  </div>

                  {/* Resume selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Resume Attachment
                    </label>
                    <div className="p-4 rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium">
                          {user?.candidateProfile?.resumeName || "Standard_Candidate_Resume.pdf"}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        Attached
                      </span>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Cover Letter / Note to Hiring Manager (Optional)
                    </label>
                    <textarea
                      rows={4}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Share why you're a great fit for this specific position and highlight relevant projects..."
                      className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white resize-none"
                      id="cover-letter-input"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setApplyModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
                      id="submit-application-btn"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Application</span>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
