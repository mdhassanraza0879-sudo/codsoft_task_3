import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApplicationStatus, WorkplaceType, JobType, ExperienceLevel } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(min?: number | null, max?: number | null, currency = "USD"): string {
  if (!min && !max) return "Competitive";
  const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency;
  if (min && max) {
    return `${sym}${(min / 1000).toFixed(0)}k - ${sym}${(max / 1000).toFixed(0)}k / yr`;
  }
  if (min) return `From ${sym}${(min / 1000).toFixed(0)}k / yr`;
  if (max) return `Up to ${sym}${(max / 1000).toFixed(0)}k / yr`;
  return "Competitive";
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 3600 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function getStatusBadge(status: ApplicationStatus | string) {
  switch (status) {
    case ApplicationStatus.APPLIED:
      return {
        label: "Applied",
        bg: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
      };
    case ApplicationStatus.UNDER_REVIEW:
      return {
        label: "Under Review",
        bg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      };
    case ApplicationStatus.SHORTLISTED:
      return {
        label: "Shortlisted",
        bg: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
      };
    case ApplicationStatus.INTERVIEW:
      return {
        label: "Interview",
        bg: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
      };
    case ApplicationStatus.HIRED:
      return {
        label: "Hired",
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
      };
    case ApplicationStatus.REJECTED:
      return {
        label: "Not Selected",
        bg: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
      };
    default:
      return {
        label: status,
        bg: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800",
      };
  }
}

export function getJobTypeLabel(type: JobType | string): string {
  switch (type) {
    case JobType.FULL_TIME:
      return "Full-time";
    case JobType.PART_TIME:
      return "Part-time";
    case JobType.CONTRACT:
      return "Contract";
    case JobType.INTERNSHIP:
      return "Internship";
    case JobType.FREELANCE:
      return "Freelance";
    default:
      return type;
  }
}

export function getWorkplaceLabel(type: WorkplaceType | string): string {
  switch (type) {
    case WorkplaceType.REMOTE:
      return "Remote";
    case WorkplaceType.HYBRID:
      return "Hybrid";
    case WorkplaceType.ON_SITE:
      return "On-site";
    default:
      return type;
  }
}

export function getExperienceLabel(level: ExperienceLevel | string): string {
  switch (level) {
    case ExperienceLevel.ENTRY_LEVEL:
      return "Entry Level";
    case ExperienceLevel.MID_LEVEL:
      return "Mid Level";
    case ExperienceLevel.SENIOR_LEVEL:
      return "Senior Level";
    case ExperienceLevel.LEAD:
      return "Lead / Staff";
    case ExperienceLevel.EXECUTIVE:
      return "Executive / Director";
    default:
      return level;
  }
}
