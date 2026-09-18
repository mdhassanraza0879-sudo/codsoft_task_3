import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role, ApplicationStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== Role.RECRUITER && user.role !== Role.ADMIN)) {
      return NextResponse.json({ success: false, message: "Unauthorized. Recruiter access required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    const companyId = user.recruiterProfile?.companyId;
    const baseWhere = companyId ? { job: { companyId } } : { job: { recruiterId: user.id } };

    const where = jobId ? { ...baseWhere, jobId } : baseWhere;

    const applications = await prisma.application.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            workplaceType: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            candidateProfile: {
              select: {
                headline: true,
                skills: true,
                location: true,
                resumeUrl: true,
                resumeName: true,
              },
            },
          },
        },
        notes: {
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, role: true } },
          },
        },
      },
    });

    // Group by status
    const pipeline = {
      [ApplicationStatus.APPLIED]: applications.filter((a) => a.status === ApplicationStatus.APPLIED),
      [ApplicationStatus.UNDER_REVIEW]: applications.filter((a) => a.status === ApplicationStatus.UNDER_REVIEW),
      [ApplicationStatus.SHORTLISTED]: applications.filter((a) => a.status === ApplicationStatus.SHORTLISTED),
      [ApplicationStatus.INTERVIEW]: applications.filter((a) => a.status === ApplicationStatus.INTERVIEW),
      [ApplicationStatus.REJECTED]: applications.filter((a) => a.status === ApplicationStatus.REJECTED),
      [ApplicationStatus.HIRED]: applications.filter((a) => a.status === ApplicationStatus.HIRED),
    };

    return NextResponse.json({
      success: true,
      pipeline,
      totalCandidates: applications.length,
    });
  } catch (error) {
    console.error("GET /api/recruiter/pipeline error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch candidate pipeline" }, { status: 500 });
  }
}
