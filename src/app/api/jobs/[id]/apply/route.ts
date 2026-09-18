import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ApplicationStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, message: "Please log in to apply for this job." }, { status: 401 });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    if (job.status !== "PUBLISHED") {
      return NextResponse.json({ success: false, message: "This job listing is no longer accepting applications." }, { status: 400 });
    }

    // Duplicate application check
    const existingApp = await prisma.application.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId: user.id,
        },
      },
    });

    if (existingApp) {
      return NextResponse.json(
        { success: false, message: "You have already submitted an application for this position." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { resumeUrl, coverLetter } = body;

    // Use candidate profile resume if none explicitly passed
    const finalResumeUrl =
      resumeUrl ||
      user.candidateProfile?.resumeUrl ||
      "/uploads/resumes/default-resume.pdf";

    const application = await prisma.application.create({
      data: {
        jobId,
        userId: user.id,
        resumeUrl: finalResumeUrl,
        coverLetter: coverLetter ? coverLetter.trim() : null,
        status: ApplicationStatus.APPLIED,
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! Track status in your applications dashboard.",
      application,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/jobs/[id]/apply error:", error);
    return NextResponse.json({ success: false, message: "Failed to submit application" }, { status: 500 });
  }
}
