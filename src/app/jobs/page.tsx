"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatSalary, getJobTypeLabel, getWorkplaceLabel, getExperienceLabel } from "@/lib/utils";
import {
  Search,
  MapPin,
  Briefcase,
  SlidersHorizontal,
  Bookmark,
  ShieldCheck,
  Building2,
  Clock,
  DollarSign,
  ChevronRight,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

  // Search & Filter State
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [workplace, setWorkplace] = useState(searchParams.get("workplace") || "");
  const [jobType, setJobType] = useState(searchParams.get("jobType") || "");
  const [experience, setExperience] = useState(searchParams.get("experience") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [minSalary, setMinSalary] = useState(searchParams.get("minSalary") || "");

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (location) params.set("location", location);
      if (workplace) params.set("workplace", workplace);
      if (jobType) params.set("jobType", jobType);
      if (experience) params.set("experience", experience);
      if (minSalary) params.set("minSalary", minSalary);
      if (sort) params.set("sort", sort);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
        setTotalCount(data.pagination.total);

        // Populate initial saved set
        const saved = new Set<string>();
        data.jobs.forEach((j: any) => {
          if (j.isSaved) saved.add(j.id);
        });
        setSavedJobIds(saved);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [q, location, workplace, jobType, experience, minSalary, sort, toast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleToggleSave = async (e: React.MouseEvent, jobId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to bookmark jobs");
      router.push("/login?redirect=/jobs");
      return;
    }

    const isCurrentlySaved = savedJobIds.has(jobId);
    const newSaved = new Set(savedJobIds);

    if (isCurrentlySaved) {
      newSaved.delete(jobId);
      setSavedJobIds(newSaved);
      try {
        await fetch(`/api/jobs/${jobId}/save`, { method: "DELETE" });
        toast.info("Job removed from saved bookmarks");
      } catch {
        toast.error("Failed to update bookmark");
      }
    } else {
      newSaved.add(jobId);
      setSavedJobIds(newSaved);
      try {
        await fetch(`/api/jobs/${jobId}/save`, { method: "POST" });
        toast.success("Job saved to your bookmarks");
      } catch {
        toast.error("Failed to save job");
      }
    }
  };

  const clearFilters = () => {
    setQ("");
    setLocation("");
    setWorkplace("");
    setJobType("");
    setExperience("");
    setMinSalary("");
    setSort("newest");
  };

  const hasActiveFilters = Boolean(q || location || workplace || jobType || experience || minSalary);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Search Bar */}
        <div className="mb-8 space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Explore Tech Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Browse verified roles across software engineering, product, and design.
            </p>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-2"
          >
            <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search job title, skill (React, Node, DevOps)..."
                className="w-full bg-transparent text-sm placeholder:text-slate-400 focus:outline-none text-slate-900 dark:text-white"
                id="search-input"
              />
            </div>

            <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (e.g. San Francisco, New York)..."
                className="w-full bg-transparent text-sm placeholder:text-slate-400 focus:outline-none text-slate-900 dark:text-white"
                id="location-input"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm transition-all shadow-sm"
                id="search-submit-btn"
              >
                Find Jobs
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="md:hidden px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </form>
        </div>

        {/* Main Content Layout: Sidebar Filters + Results */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden md:block col-span-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                Filters
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Workplace Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Workplace Type
              </label>
              <div className="space-y-1.5">
                {[
                  { value: "", label: "All Workplaces" },
                  { value: "REMOTE", label: "Remote Only" },
                  { value: "HYBRID", label: "Hybrid" },
                  { value: "ON_SITE", label: "On-site" },
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                    <input
                      type="radio"
                      name="workplace"
                      checked={workplace === item.value}
                      onChange={() => setWorkplace(item.value)}
                      className="text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Employment Type
              </label>
              <div className="space-y-1.5">
                {[
                  { value: "", label: "All Types" },
                  { value: "FULL_TIME", label: "Full-Time" },
                  { value: "PART_TIME", label: "Part-Time" },
                  { value: "CONTRACT", label: "Contract" },
                  { value: "INTERNSHIP", label: "Internship" },
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                    <input
                      type="radio"
                      name="jobType"
                      checked={jobType === item.value}
                      onChange={() => setJobType(item.value)}
                      className="text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Experience Level
              </label>
              <div className="space-y-1.5">
                {[
                  { value: "", label: "Any Experience" },
                  { value: "ENTRY_LEVEL", label: "Entry Level" },
                  { value: "MID_LEVEL", label: "Mid Level" },
                  { value: "SENIOR_LEVEL", label: "Senior Level" },
                  { value: "LEAD", label: "Lead / Staff" },
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                    <input
                      type="radio"
                      name="experience"
                      checked={experience === item.value}
                      onChange={() => setExperience(item.value)}
                      className="text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Salary Range */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Min Base Salary
                </label>
                <span className="text-xs font-semibold text-indigo-600">
                  {minSalary ? `$${parseInt(minSalary) / 1000}k+` : "Any"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={minSalary || 0}
                onChange={(e) => setMinSalary(e.target.value === "0" ? "" : e.target.value)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </aside>

          {/* RESULTS COLUMN */}
          <main className="col-span-1 md:col-span-3 space-y-4">
            {/* Header controls: count + sort dropdown */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Showing <span className="text-indigo-600 font-bold">{totalCount}</span> jobs available
              </span>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
                  id="sort-select"
                >
                  <option value="newest">Most Recent</option>
                  <option value="salary_desc">Highest Salary</option>
                  <option value="views">Most Viewed</option>
                  <option value="oldest">Earliest Posted</option>
                </select>
              </div>
            </div>

            {/* Loading state skeleton */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && jobs.length === 0 && (
              <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No matching jobs found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search criteria, widening your salary limits, or resetting your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Jobs list */}
            {!loading && (
              <div className="space-y-4">
                {jobs.map((job) => {
                  const isSaved = savedJobIds.has(job.id);
                  return (
                    <div
                      key={job.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-900/60 hover:shadow-md transition-all group relative"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={job.company?.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120"}
                            alt={job.company?.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-50 shrink-0"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-500">
                                {job.company?.name}
                              </span>
                              {job.company?.isVerified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                              )}
                              {job.userApplication && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Already Applied
                                </span>
                              )}
                            </div>
                            <Link
                              href={`/jobs/${job.id}`}
                              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors block"
                            >
                              {job.title}
                            </Link>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {job.location}
                              </span>
                              <span>•</span>
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                                {getWorkplaceLabel(job.workplaceType)}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                                {getJobTypeLabel(job.jobType)}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium">
                                {getExperienceLabel(job.experienceLevel)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Top right actions: Salary & Bookmark */}
                        <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 shrink-0">
                          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                          </span>
                          <button
                            onClick={(e) => handleToggleSave(e, job.id)}
                            className={`p-2 rounded-xl border transition-colors ${
                              isSaved
                                ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300"
                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            }`}
                            title={isSaved ? "Saved to bookmarks" : "Save job"}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 my-4 leading-relaxed">
                        {job.description}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-wrap gap-1.5">
                          {job.skills?.slice(0, 4).map((skill: string) => (
                            <span
                              key={skill}
                              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills?.length > 4 && (
                            <span className="text-[11px] text-slate-400 px-1 py-0.5">
                              +{job.skills.length - 4}
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/jobs/${job.id}`}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
                        >
                          <span>Apply Now</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
