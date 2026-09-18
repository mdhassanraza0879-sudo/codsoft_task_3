"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Users,
  Search,
  MapPin,
  FileText,
  Briefcase,
  ExternalLink,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function CandidatesDirectoryPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadCandidates = async (q = "") => {
    setLoading(true);
    try {
      const url = q ? `/api/recruiter/candidates?q=${encodeURIComponent(q)}` : "/api/recruiter/candidates";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
      }
    } catch {
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCandidates(searchQuery);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Talent Discovery
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Engineering & Design Talent Pool
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pre-screened candidates available for active hiring interviews.
          </p>
        </div>

        {/* SEARCH FORM */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name, skill, or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Search
          </button>
        </form>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No candidates match your criteria</h3>
            <p className="text-xs text-slate-500">Try broadening your search keyword or clearing filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((c) => {
              const prof = c.candidateProfile;
              return (
                <div
                  key={c.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Candidate"}
                        alt={c.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-50 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {c.name}
                        </h3>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium line-clamp-1">
                          {prof?.headline || "Software Candidate"}
                        </p>
                        {prof?.location && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>{prof.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {prof?.bio && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {prof.bio}
                      </p>
                    )}

                    {prof?.skills && prof.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {prof.skills.slice(0, 4).map((sk: string) => (
                          <span
                            key={sk}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    {prof?.resumeUrl ? (
                      <Link
                        href={prof.resumeUrl}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-indigo-600 font-semibold hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Resume</span>
                      </Link>
                    ) : (
                      <span className="text-slate-400">Resume on request</span>
                    )}

                    <Link
                      href={`mailto:${c.email}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold"
                    >
                      Contact
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
