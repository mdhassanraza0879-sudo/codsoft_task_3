import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role, JobStatus } from "@prisma/client";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json({ success: false, message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const [
      totalUsers,
      totalCandidates,
      totalRecruiters,
      totalJobs,
      activeJobs,
      totalCompanies,
      totalApplications,
      recentUsers,
      recentJobs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.CANDIDATE } }),
      prisma.user.count({ where: { role: Role.RECRUITER } }),
      prisma.job.count(),
      prisma.job.count({ where: { status: JobStatus.PUBLISHED } }),
      prisma.company.count(),
      prisma.application.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          isActive: true,
          createdAt: true,
        },
      }),
      prisma.job.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          company: { select: { name: true } },
          _count: { select: { applications: true } },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalJobs,
        activeJobs,
        totalCompanies,
        totalApplications,
      },
      recentUsers,
      recentJobs,
    });
  } catch (error) {
    console.error("GET /api/admin/dashboard error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch admin dashboard" }, { status: 500 });
  }
}
