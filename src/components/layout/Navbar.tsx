"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Briefcase,
  Search,
  Bookmark,
  FileText,
  User,
  LogOut,
  LayoutDashboard,
  Building2,
  Kanban,
  ShieldCheck,
  Menu,
  X,
  PlusCircle,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <NextLink href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Career<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                PRO
              </span>
            </div>
          </div>
        </NextLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NextLink
            href="/jobs"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/jobs") && !pathname.startsWith("/recruiter")
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900"
            }`}
          >
            Find Jobs
          </NextLink>

          {/* Role specific links */}
          {user?.role === "CANDIDATE" && (
            <>
              <NextLink
                href="/dashboard"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900"
                }`}
              >
                Dashboard
              </NextLink>
              <NextLink
                href="/applications"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/applications")
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900"
                }`}
              >
                Applications
              </NextLink>
              <NextLink
                href="/saved-jobs"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/saved-jobs")
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900"
                }`}
              >
                Saved
              </NextLink>
            </>
          )}

          {user?.role === "RECRUITER" && (
            <>
              <NextLink
                href="/recruiter/dashboard"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/recruiter/dashboard")
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900"
                }`}
              >
                Recruiter Hub
              </NextLink>
              <NextLink
                href="/recruiter/pipeline"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive("/recruiter/pipeline")
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900"
                }`}
              >
                <Kanban className="w-4 h-4 text-indigo-500" />
                Pipeline
              </NextLink>
              <NextLink
                href="/recruiter/jobs"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/recruiter/jobs") && !isActive("/recruiter/jobs/new")
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900"
                }`}
              >
                Job Listings
              </NextLink>
              <NextLink
                href="/recruiter/candidates"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/recruiter/candidates")
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900"
                }`}
              >
                Candidates
              </NextLink>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <NextLink
                href="/admin"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  pathname === "/admin"
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Admin Overview
              </NextLink>
              <NextLink
                href="/admin/users"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/admin/users")
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900"
                }`}
              >
                Users
              </NextLink>
              <NextLink
                href="/admin/jobs"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/admin/jobs")
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900"
                }`}
              >
                Moderation
              </NextLink>
              <NextLink
                href="/admin/companies"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/admin/companies")
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900"
                }`}
              >
                Companies
              </NextLink>
            </>
          )}
        </nav>

        {/* Right CTA / Auth controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/20 transition-all"
                id="user-menu-button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-slate-100"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">{user.role.toLowerCase()}</div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {user.role}
                    </span>
                  </div>

                  {user.role === "CANDIDATE" && (
                    <>
                      <NextLink
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard
                      </NextLink>
                      <NextLink
                        href="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Edit Profile
                      </NextLink>
                      <NextLink
                        href="/applications"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <FileText className="w-4 h-4 text-slate-400" />
                        My Applications
                      </NextLink>
                      <NextLink
                        href="/saved-jobs"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <Bookmark className="w-4 h-4 text-slate-400" />
                        Saved Jobs
                      </NextLink>
                    </>
                  )}

                  {user.role === "RECRUITER" && (
                    <>
                      <NextLink
                        href="/recruiter/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard
                      </NextLink>
                      <NextLink
                        href="/recruiter/jobs/new"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <PlusCircle className="w-4 h-4 text-indigo-600" />
                        Post a Job
                      </NextLink>
                      <NextLink
                        href="/recruiter/pipeline"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <Kanban className="w-4 h-4 text-slate-400" />
                        Kanban Pipeline
                      </NextLink>
                      <NextLink
                        href="/recruiter/company"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <Building2 className="w-4 h-4 text-slate-400" />
                        Company Profile
                      </NextLink>
                    </>
                  )}

                  {user.role === "ADMIN" && (
                    <NextLink
                      href="/admin"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Admin Control Center
                    </NextLink>
                  )}

                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1">
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NextLink
                href="/login"
                className="px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors"
                id="login-btn"
              >
                Sign In
              </NextLink>
              <NextLink
                href="/register"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20 transition-all hover:shadow"
                id="register-btn"
              >
                Get Started
              </NextLink>
            </div>
          )}

          {/* Quick Post Job CTA button for desktop */}
          {user?.role === "RECRUITER" && (
            <NextLink
              href="/recruiter/jobs/new"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Post Job
            </NextLink>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4">
          <NextLink
            href="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Find Jobs
          </NextLink>

          {user?.role === "CANDIDATE" && (
            <>
              <NextLink
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Candidate Dashboard
              </NextLink>
              <NextLink
                href="/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Applications
              </NextLink>
              <NextLink
                href="/saved-jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Saved Jobs
              </NextLink>
              <NextLink
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                My Profile
              </NextLink>
            </>
          )}

          {user?.role === "RECRUITER" && (
            <>
              <NextLink
                href="/recruiter/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Recruiter Hub
              </NextLink>
              <NextLink
                href="/recruiter/pipeline"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Kanban Pipeline
              </NextLink>
              <NextLink
                href="/recruiter/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Job Listings
              </NextLink>
              <NextLink
                href="/recruiter/jobs/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
              >
                + Post New Job
              </NextLink>
              <NextLink
                href="/recruiter/company"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Company Profile
              </NextLink>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <NextLink
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Admin Control
              </NextLink>
              <NextLink
                href="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Manage Users
              </NextLink>
              <NextLink
                href="/admin/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Job Moderation
              </NextLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
