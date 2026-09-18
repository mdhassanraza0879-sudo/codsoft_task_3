import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || (user.role !== Role.RECRUITER && user.role !== Role.ADMIN)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const application = await prisma.application.findUnique({ where: { id } });
    if (!application) {
      return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
    }

    const { content } = await req.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, message: "Note content cannot be blank" }, { status: 400 });
    }

    const note = await prisma.recruiterNote.create({
      data: {
        applicationId: id,
        authorId: user.id,
        content: content.trim(),
      },
      include: {
        author: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Recruiter note added successfully",
      note,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/applications/[id]/notes error:", error);
    return NextResponse.json({ success: false, message: "Failed to add note" }, { status: 500 });
  }
}
