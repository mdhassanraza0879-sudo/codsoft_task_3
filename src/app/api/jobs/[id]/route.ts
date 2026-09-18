import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        savedBy: user?.id ? { where: { userId: user.id } } : false,
        applications: user?.id ? { where: { userId: user.id } } : false,
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    // Increment view count asynchronously
    prisma.job.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {});

    const isSaved = user?.id ? job.savedBy && job.savedBy.length > 0 : false;
    const userApplication = user?.id && job.applications && job.applications.length > 0 ? job.applications[0] : null;

    return NextResponse.json({
      success: true,
      job: {
        ...job,
        isSaved,
        userApplication,
        savedBy: undefined,
      },
    });
  } catch (error) {
    console.error("GET /api/jobs/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch job details" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || (user.role !== Role.RECRUITER && user.role !== Role.ADMIN)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    // Only owner recruiter or admin can edit
    if (user.role === Role.RECRUITER && job.recruiterId !== user.id) {
      return NextResponse.json({ success: false, message: "Forbidden: You cannot edit jobs posted by another recruiter" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      location,
      workplaceType,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      currency,
      description,
      responsibilities,
      requirements,
      benefits,
      skills,
      status,
      deadline,
    } = body;

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(location && { location: location.trim() }),
        ...(workplaceType && { workplaceType }),
        ...(jobType && { jobType }),
        ...(experienceLevel && { experienceLevel }),
        ...(salaryMin !== undefined && { salaryMin: salaryMin ? parseInt(salaryMin) : null }),
        ...(salaryMax !== undefined && { salaryMax: salaryMax ? parseInt(salaryMax) : null }),
        ...(currency && { currency }),
        ...(description && { description: description.trim() }),
        ...(responsibilities && { responsibilities }),
        ...(requirements && { requirements }),
        ...(benefits && { benefits }),
        ...(skills && { skills }),
        ...(status && { status }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("PUT /api/jobs/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || (user.role !== Role.RECRUITER && user.role !== Role.ADMIN)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    if (user.role === Role.RECRUITER && job.recruiterId !== user.id) {
      return NextResponse.json({ success: false, message: "Forbidden: You cannot delete jobs posted by another recruiter" }, { status: 403 });
    }

    await prisma.job.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/jobs/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete job" }, { status: 500 });
  }
}
