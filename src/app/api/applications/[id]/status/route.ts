import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role, ApplicationStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || (user.role !== Role.RECRUITER && user.role !== Role.ADMIN)) {
      return NextResponse.json({ success: false, message: "Unauthorized. Recruiter or Admin access required." }, { status: 403 });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!application) {
      return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
    }

    const body = await req.json();
    const { status, note } = body;

    if (!status || !Object.values(ApplicationStatus).includes(status)) {
      return NextResponse.json(
        { success: false, message: `Invalid status. Must be one of: ${Object.values(ApplicationStatus).join(", ")}` },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const app = await tx.application.update({
        where: { id },
        data: { status },
        include: {
          job: {
            include: { company: true },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (note && note.trim()) {
        await tx.recruiterNote.create({
          data: {
            applicationId: id,
            authorId: user.id,
            content: note.trim(),
          },
        });
      }

      return app;
    });

    return NextResponse.json({
      success: true,
      message: `Candidate status updated to ${status.replace("_", " ")}`,
      application: updated,
    });
  } catch (error) {
    console.error("PATCH /api/applications/[id]/status error:", error);
    return NextResponse.json({ success: false, message: "Failed to update application status" }, { status: 500 });
  }
}
