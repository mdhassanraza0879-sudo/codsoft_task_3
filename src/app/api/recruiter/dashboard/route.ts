import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role, ApplicationStatus, JobStatus } from "@prisma/client";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== Role.RECRUITER && user.role !== Role.ADMIN)) {
      return NextResponse.json({ success: false, message: "Unauthorized. Recruiter access required." }, { status: 403 });
    }

    const companyId = user.recruiterProfile?.companyId;

    // Scope queries to company or recruiter
    const jobWhere = companyId ? { companyId } : { recruiterId: user.id };
    const appWhere = companyId ? { job: { companyId } } : { job: { recruiterId: user.id } };

    const [
      activeJobsCount,
      totalJobsCount,
      totalApplicationsCount,
      underReviewCount,
      shortlistedCount,
      interviewCount,
      hiredCount,
      rejectedCount,
      recentApplications,
      jobs,
    ] = await Promise.all([
      prisma.job.count({ where: { ...jobWhere, status: JobStatus.PUBLISHED } }),
      prisma.job.count({ where: jobWhere }),
      prisma.application.count({ where: appWhere }),
      prisma.application.count({ where: { ...appWhere, status: ApplicationStatus.UNDER_REVIEW } }),
      prisma.application.count({ where: { ...appWhere, status: ApplicationStatus.SHORTLISTED } }),
      prisma.application.count({ where: { ...appWhere, status: ApplicationStatus.INTERVIEW } }),
      prisma.application.count({ where: { ...appWhere, status: ApplicationStatus.HIRED } }),
      prisma.application.count({ where: { ...appWhere, status: ApplicationStatus.REJECTED } }),
      prisma.application.findMany({
        where: appWhere,
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          job: { select: { id: true, title: true } },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              candidateProfile: { select: { headline: true, location: true } },
            },
          },
        },
      }),
      prisma.job.findMany({
        where: jobWhere,
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { applications: true } },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        activeJobs: activeJobsCount,
        totalJobs: totalJobsCount,
        totalApplications: totalApplicationsCount,
        inReview: underReviewCount + shortlistedCount,
        interviews: interviewCount,
        hires: hiredCount,
        rejected: rejectedCount,
      },
      recentApplications,
      jobs,
    });
  } catch (error) {
    console.error("GET /api/recruiter/dashboard error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch recruiter dashboard data" }, { status: 500 });
  }
}
