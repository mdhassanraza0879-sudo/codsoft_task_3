import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatSalary, getJobTypeLabel, getWorkplaceLabel } from "@/lib/utils";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  Code2,
  Palette,
  Cloud,
  Database,
  BarChart3,
  Cpu,
  Bookmark,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch featured published jobs
  const featuredJobs = await prisma.job.findMany({
    where: { status: "PUBLISHED" },
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      company: true,
      _count: {
        select: { applications: true },
      },
    },
  });

  // Fetch top verified companies
  const companies = await prisma.company.findMany({
    take: 6,
    include: {
      _count: {
        select: { jobs: true },
      },
    },
  });

  // Category listing
  const categories = [
    { name: "Software Development", icon: Code2, count: "1,240+ jobs", query: "software" },
    { name: "Cloud & DevOps", icon: Cloud, count: "580+ jobs", query: "devops" },
    { name: "UI/UX & Product Design", icon: Palette, count: "410+ jobs", query: "design" },
    { name: "Data Science & AI", icon: Database, count: "720+ jobs", query: "data" },
    { name: "Product Management", icon: BarChart3, count: "330+ jobs", query: "product" },
    { name: "Systems & Security", icon: Cpu, count: "290+ jobs", query: "security" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,rgba(234,88,12,0.08),transparent)]"></div>
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-12 left-1/4 w-72 h-72 bg-orange-400/15 dark:bg-orange-600/10 rounded-full blur-3xl -z-10 animate-glow pointer-events-none"></div>
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-amber-400/15 dark:bg-amber-600/10 rounded-full blur-3xl -z-10 animate-glow pointer-events-none" style={{ animationDelay: '2s' }}></div>

        {/* Floating Hero Badge - Left */}
        <div className="hidden xl:flex absolute left-8 top-36 items-center gap-3 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-xl shadow-orange-500/10 border border-orange-200/70 dark:border-slate-800 animate-float backdrop-blur-md z-10 hover-lift">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-lg">
            ★
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">98% Match Rate</p>
            <p className="text-[10px] text-slate-500">Verified Tech Opportunities</p>
          </div>
        </div>

        {/* Floating Hero Badge - Right */}
        <div className="hidden xl:flex absolute right-8 top-44 items-center gap-3 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-xl shadow-amber-500/10 border border-amber-200/70 dark:border-slate-800 animate-float-delayed backdrop-blur-md z-10 hover-lift">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-lg">
            ⚡
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">2,400+ Hires</p>
            <p className="text-[10px] text-slate-500">Fast-Growing Startups</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Next-Generation Career & Talent Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Find the right opportunity.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Build the right team.
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              CareerHub connects vetted engineering talent with pioneering tech companies.
              Explore high-impact positions, manage your interview pipeline, and recruit with precision.
            </p>

            {/* SEARCH BOX FORM */}
            <div className="pt-2">
              <form
                action="/jobs"
                method="GET"
                className="bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-indigo-500/5 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto"
              >
                <div className="flex-1 flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Job title, skill (e.g. React, Node, DevOps)..."
                    className="w-full bg-transparent text-sm placeholder:text-slate-400 focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex-1 flex items-center gap-3 px-3 py-2">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    name="location"
                    placeholder="Location or 'Remote'..."
                    className="w-full bg-transparent text-sm placeholder:text-slate-400 focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20 whitespace-nowrap"
                  >
                    Search Jobs
                  </button>
                  <Link
                    href="/recruiter/jobs/new"
                    className="hidden sm:inline-flex px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors whitespace-nowrap"
                  >
                    Post a Job
                  </Link>
                </div>
              </form>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
                <span className="font-medium text-slate-700 dark:text-slate-300">Popular:</span>
                {["Next.js", "React", "TypeScript", "PostgreSQL", "DevOps", "Remote"].map((tag) => (
                  <Link
                    key={tag}
                    href={`/jobs?q=${tag}`}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-slate-200/60 dark:border-slate-800"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS COUNTER */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">12,500+</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Active Tech Jobs</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">1,800+</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Verified Companies</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">45,000+</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Engineers & Creators</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">98%</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Hiring Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED JOBS SECTION */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Verified Openings
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Featured Opportunities
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Hand-picked high-growth engineering and product positions from verified partners.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
          >
            <span>View all 12+ positions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover-lift flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={job.company.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120"}
                      alt={job.company.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-50"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-slate-500">{job.company.name}</span>
                        {job.company.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                        )}
                      </div>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1"
                      >
                        {job.title}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                    {getWorkplaceLabel(job.workplaceType)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                    {getJobTypeLabel(job.jobType)}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {job.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="text-[11px] font-medium px-1.5 py-0.5 text-slate-400">
                      +{job.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                </span>
                <Link
                  href={`/jobs/${job.id}`}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP HIRING COMPANIES */}
      <section className="bg-slate-100/70 dark:bg-slate-900/40 py-16 lg:py-20 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Hiring Partners
            </h2>
            <p className="text-slate-500 text-sm">
              Discover opportunities with innovative companies shaping enterprise tech and fintech.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <div
                key={comp.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 hover-lift transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={comp.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120"}
                  alt={comp.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-50 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {comp.name}
                    </h3>
                    {comp.isVerified && <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1 truncate">
                    {comp.industry}
                  </p>
                  <p className="text-xs text-slate-500 truncate mb-3">{comp.location}</p>
                  <Link
                    href={`/jobs?q=${encodeURIComponent(comp.name)}`}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>{comp._count.jobs} Open Roles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAREER CATEGORIES */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Explore by Specialization
          </h2>
          <p className="text-slate-500 text-sm">
            Target your next career move by technical discipline and industry demands.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/jobs?q=${cat.query}`}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover-lift flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500">{cat.count}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Streamlined Workflow</span>
            <h2 className="text-3xl font-bold tracking-tight">How CareerHub Works</h2>
            <p className="text-slate-400 text-sm">
              Designed to eliminate hiring friction for both ambitious engineers and recruiting leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-8 space-y-4 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Create Your Profile</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Build your verified resume portfolio, highlight technical competencies, work history, and target salary expectations.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-8 space-y-4 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Direct 1-Click Apply</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Submit applications with tailored cover notes directly into recruiters' Kanban pipelines without third-party redirects.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-8 space-y-4 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Track & Close</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Monitor real-time progress through Interview stages, review direct recruiter feedback, and receive official offer letters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CAREERHUB */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Why Choose CareerHub
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built for precision, engineered for scale.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Unlike generic job boards clogged with expired listings and spam applicants, CareerHub prioritizes authentic verification, transparent compensation data, and actionable hiring pipelines.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Verified Direct Employers Only
                  </h4>
                  <p className="text-xs text-slate-500">Every posting is vetted and directly managed by active hiring teams.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Transparent Salary Disclosures
                  </h4>
                  <p className="text-xs text-slate-500">Clear base compensation, equity notes, and comprehensive benefit breakdowns.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Live Kanban Pipeline Management
                  </h4>
                  <p className="text-xs text-slate-500">Recruiters manage candidate flows with drag-and-drop ease and structured evaluation notes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-indigo-600 to-violet-700 rounded-3xl p-8 lg:p-12 text-white shadow-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>For Employers & Startups</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold leading-snug">
              Looking to hire exceptional engineers this quarter?
            </h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Publish your openings, access pre-screened technical candidate profiles, and manage interviews all within our intuitive recruiter suite.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/register?role=RECRUITER"
                className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 shadow-md transition-colors"
              >
                Start Hiring Now
              </Link>
              <Link
                href="/jobs"
                className="px-5 py-3 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/40 text-white font-medium text-sm transition-colors"
              >
                Explore Candidate Directory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
