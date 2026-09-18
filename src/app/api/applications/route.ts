import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role, ApplicationStatus, Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as ApplicationStatus | null;
    const jobId = searchParams.get("jobId");

    const where: Prisma.ApplicationWhereInput = {};

    if (status && Object.values(ApplicationStatus).includes(status)) {
      where.status = status;
    }

    if (jobId) {
      where.jobId = jobId;
    }

    if (user.role === Role.CANDIDATE) {
      where.userId = user.id;
    } else if (user.role === Role.RECRUITER) {
      // Recruiter sees applications for their posted jobs or their company
      const companyId = user.recruiterProfile?.companyId;
      if (companyId) {
        where.job = { companyId };
      } else {
        where.job = { recruiterId: user.id };
      }
    }
    // Admin sees all

    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                location: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            candidateProfile: true,
          },
        },
        notes: {
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch applications" }, { status: 500 });
  }
}
