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

    if (!user || (user.role !== Role.RECRUITER && user.role !== Role.ADMIN)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const candidate = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        candidateProfile: true,
        resumes: {
          orderBy: { createdAt: "desc" },
        },
        applications: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
                company: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!candidate || candidate.candidateProfile === null) {
      return NextResponse.json({ success: false, message: "Candidate not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      candidate,
    });
  } catch (error) {
    console.error("GET /api/candidates/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch candidate details" }, { status: 500 });
  }
}
