"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Briefcase, Mail, Lock, ArrowRight, Loader2, Sparkles, Check } from "lucide-react";

function LoginForm() {
  const { login } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success("Welcome back to CareerHub!");
      if (redirect) {
        router.push(redirect);
      } else if (result.user?.role === "ADMIN") {
        router.push("/admin");
      } else if (result.user?.role === "RECRUITER") {
        router.push("/recruiter/dashboard");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } else {
      setErrorMessage(result.message);
      toast.error(result.message);
    }
  };

  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const handleDemoLogin = async (demoEmail: string, demoPass: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage("");
    setActiveDemo(roleName);
    setLoading(true);

    const result = await login(demoEmail, demoPass);
    setLoading(false);
    setActiveDemo(null);

    if (result.success) {
      toast.success(`Signed in as ${roleName}!`);
      if (redirect) {
        router.push(redirect);
      } else if (result.user?.role === "ADMIN") {
        router.push("/admin");
      } else if (result.user?.role === "RECRUITER") {
        router.push("/recruiter/dashboard");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } else {
      setErrorMessage(result.message);
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Career<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white pt-2">
            Welcome back
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your recruitment pipeline and career dashboard
          </p>
        </div>

        {/* DEMO ACCOUNTS 1-CLICK INSTANT LOGIN */}
        <div className="p-4 rounded-2xl bg-orange-50/80 dark:bg-slate-900/80 border border-orange-200/70 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-950 dark:text-orange-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 animate-pulse" />
              1-Click Demo Accounts (Instant Login)
            </span>
            <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wider">
              Tap to enter
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoLogin("john.dev@example.com", "Candidate@1234", "Candidate")}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-orange-200/80 dark:border-slate-700 hover:border-orange-500 hover:shadow-md hover:shadow-orange-500/10 text-left transition-all group disabled:opacity-50 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-orange-600 transition-colors">
                  Candidate
                </span>
                {activeDemo === "Candidate" ? (
                  <Loader2 className="w-3 h-3 animate-spin text-orange-600" />
                ) : (
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">John Doe</span>
              <span className="text-[9px] text-orange-600 font-semibold block truncate">Applicant →</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoLogin("recruiter@techcorp.com", "Recruiter@1234", "Recruiter")}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-orange-200/80 dark:border-slate-700 hover:border-orange-500 hover:shadow-md hover:shadow-orange-500/10 text-left transition-all group disabled:opacity-50 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-orange-600 transition-colors">
                  Recruiter
                </span>
                {activeDemo === "Recruiter" ? (
                  <Loader2 className="w-3 h-3 animate-spin text-orange-600" />
                ) : (
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">TechCorp</span>
              <span className="text-[9px] text-orange-600 font-semibold block truncate">Hiring Suite →</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoLogin("admin@careerhub.com", "Admin@1234", "Admin")}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-orange-200/80 dark:border-slate-700 hover:border-orange-500 hover:shadow-md hover:shadow-orange-500/10 text-left transition-all group disabled:opacity-50 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-orange-600 transition-colors">
                  Admin
                </span>
                {activeDemo === "Admin" ? (
                  <Loader2 className="w-3 h-3 animate-spin text-orange-600" />
                ) : (
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">Platform Lead</span>
              <span className="text-[9px] text-orange-600 font-semibold block truncate">Moderation →</span>
            </button>
          </div>
        </div>

        {/* LOGIN FORM */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
                  id="login-email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
                  id="login-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              id="login-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
