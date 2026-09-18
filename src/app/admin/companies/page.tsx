"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import {
  Building2,
  ShieldCheck,
  ExternalLink,
  ChevronLeft,
  Loader2,
  Briefcase,
  Users,
} from "lucide-react";

export default function AdminCompaniesPage() {
  const toast = useToast();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/companies");
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies || []);
      }
    } catch {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleToggleVerify = async (companyId: string, currentVerified: boolean) => {
    try {
      const res = await fetch(`/api/admin/companies/${companyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !currentVerified }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        loadCompanies();
      } else {
        toast.error("Failed to update verification status");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Admin Overview</span>
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Employer Verification & Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Grant verified trust badges to legitimate companies and review hiring scale.
          </p>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <div
                key={comp.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={comp.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120"}
                        alt={comp.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-50"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{comp.name}</h3>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{comp.industry}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {comp.about || "Enterprise employer recruiting on CareerHub."}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{comp._count?.jobs || 0} Openings</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                      <span>{comp._count?.recruiters || 0} Recruiters</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleVerify(comp.id, comp.isVerified)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      comp.isVerified
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <ShieldCheck className={`w-4 h-4 ${comp.isVerified ? "text-indigo-600" : "text-slate-400"}`} />
                    <span>{comp.isVerified ? "Verified (Revoke)" : "Unverified (Grant)"}</span>
                  </button>

                  {comp.website && (
                    <a
                      href={comp.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
