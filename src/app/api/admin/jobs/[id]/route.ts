import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role, JobStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { status } = await req.json();
    if (!status || !Object.values(JobStatus).includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid job status" }, { status: 400 });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: { status },
      include: {
        company: { select: { name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Job listing status updated to ${status}`,
      job: updatedJob,
    });
  } catch (error) {
    console.error("PATCH /api/admin/jobs/[id] error:", error);
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

    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await prisma.job.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Job listing permanently removed by admin",
    });
  } catch (error) {
    console.error("DELETE /api/admin/jobs/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete job" }, { status: 500 });
  }
}
