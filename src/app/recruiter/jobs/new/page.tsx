"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Plus,
  X,
  ChevronLeft,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function NewJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [workplaceType, setWorkplaceType] = useState("HYBRID");
  const [jobType, setJobType] = useState("FULL_TIME");
  const [experienceLevel, setExperienceLevel] = useState("MID_LEVEL");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [benefitsText, setBenefitsText] = useState("");
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript", "Node.js"]);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) {
      toast.error("Please fill in all mandatory fields");
      return;
    }

    const responsibilities = responsibilitiesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const requirements = requirementsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const benefits = benefitsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    setLoading(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          location,
          workplaceType,
          jobType,
          experienceLevel,
          salaryMin: salaryMin || null,
          salaryMax: salaryMax || null,
          currency,
          description,
          responsibilities,
          requirements,
          benefits,
          skills,
          status: "PUBLISHED",
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        toast.success("Job posting published live!");
        router.push("/recruiter/jobs");
      } else {
        toast.error(data.message || "Failed to create job posting");
      }
    } catch {
      setLoading(false);
      toast.error("Network error submitting job");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/recruiter/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Job Listings</span>
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Publish New Opportunity
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create an authentic verified listing to attract top software engineering and design talent.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CORE DETAILS */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Role Essentials</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Staff Full Stack Engineer (Next.js & Node.js)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
                  id="job-title-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location (City, State or Country) *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
                  id="job-location-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Workplace Arrangement
                </label>
                <select
                  value={workplaceType}
                  onChange={(e) => setWorkplaceType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white font-medium"
                >
                  <option value="REMOTE">Remote (Work anywhere)</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ON_SITE">On-site Office</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Employment Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white font-medium"
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="FREELANCE">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Seniority / Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white font-medium"
                >
                  <option value="ENTRY_LEVEL">Entry Level (0-2 yrs)</option>
                  <option value="MID_LEVEL">Mid Level (2-5 yrs)</option>
                  <option value="SENIOR_LEVEL">Senior Level (5+ yrs)</option>
                  <option value="LEAD">Staff / Principal / Lead</option>
                  <option value="EXECUTIVE">Executive / Director</option>
                </select>
              </div>
            </div>
          </div>

          {/* COMPENSATION */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Annual Compensation Range</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Minimum Base Salary ($ / yr)
                </label>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="e.g. 130000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Maximum Base Salary ($ / yr)
                </label>
                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="e.g. 175000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* DETAILED DESCRIPTION & RESPONSIBILITIES */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Detailed Description</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role Overview & Purpose *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the mission, squad structure, technical challenge, and overall goals of this position..."
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white resize-none"
                id="job-desc-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Key Responsibilities (One per line)
              </label>
              <textarea
                rows={3}
                value={responsibilitiesText}
                onChange={(e) => setResponsibilitiesText(e.target.value)}
                placeholder="Architect scalable microservices in Node.js&#10;Lead sprint retrospectives and code reviews&#10;Optimize database query performance"
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Requirements & Qualifications (One per line)
              </label>
              <textarea
                rows={3}
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                placeholder="5+ years production experience with React & TypeScript&#10;Demonstrated mastery of PostgreSQL & Prisma ORM&#10;Strong communication skills"
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Benefits & Perks (One per line)
              </label>
              <textarea
                rows={2}
                value={benefitsText}
                onChange={(e) => setBenefitsText(e.target.value)}
                placeholder="100% employer paid medical & dental&#10;Unlimited PTO&#10;$3,000 annual learning stipend"
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white resize-none"
              />
            </div>
          </div>

          {/* SKILLS TAGS */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Technical Skills & Technologies</h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Add technology tag (e.g. AWS, Docker, Next.js) and press Enter..."
                className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold"
              >
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/recruiter/jobs"
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50"
              id="publish-job-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Listing...</span>
                </>
              ) : (
                <span>Publish Job Opening</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
