import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, message: "Please log in to save jobs" }, { status: 401 });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    const saved = await prisma.savedJob.upsert({
      where: {
        jobId_userId: {
          jobId,
          userId: user.id,
        },
      },
      update: {},
      create: {
        jobId,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Job saved to your bookmarks",
      saved,
    });
  } catch (error) {
    console.error("POST /api/jobs/[id]/save error:", error);
    return NextResponse.json({ success: false, message: "Failed to save job" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await prisma.savedJob.deleteMany({
      where: {
        jobId,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Job removed from your bookmarks",
    });
  } catch (error) {
    console.error("DELETE /api/jobs/[id]/save error:", error);
    return NextResponse.json({ success: false, message: "Failed to unsave job" }, { status: 500 });
  }
}
