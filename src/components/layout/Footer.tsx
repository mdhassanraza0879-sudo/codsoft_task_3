import React from "react";
import Link from "next/link";
import { Briefcase, Heart, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/SocialIcons";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Career<span className="text-indigo-400">Hub</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Enterprise-grade modern talent acquisition platform connecting forward-thinking tech candidates with high-growth engineering teams.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">For Candidates</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  Explore Tech Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs?workplace=REMOTE" className="hover:text-white transition-colors">
                  Remote Engineering Roles
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link href="/applications" className="hover:text-white transition-colors">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Build Resume Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">For Employers</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/recruiter/jobs/new" className="hover:text-white transition-colors">
                  Post a Job Listing
                </Link>
              </li>
              <li>
                <Link href="/recruiter/pipeline" className="hover:text-white transition-colors">
                  Kanban Hiring Pipeline
                </Link>
              </li>
              <li>
                <Link href="/recruiter/candidates" className="hover:text-white transition-colors">
                  Search Candidate Talent Pool
                </Link>
              </li>
              <li>
                <Link href="/recruiter/company" className="hover:text-white transition-colors">
                  Employer Branding
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Recruiter Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Internship */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Project Specs</h4>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] font-semibold text-indigo-400 block mb-1">
                  CodSoft Internship Task 3
                </span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Full Stack Web Development Job Portal built with Next.js, TypeScript, PostgreSQL & Prisma.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <span>API Status:</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <Link href="/api/health" target="_blank" className="text-emerald-400 hover:underline">
                  Operational
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareerHub Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Engineered with excellence for CodSoft Internship</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
