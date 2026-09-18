import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        company: { select: { id: true, name: true, logo: true } },
        recruiter: { select: { id: true, name: true, email: true } },
        _count: { select: { applications: true } },
      },
    });

    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error("GET /api/admin/jobs error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch jobs" }, { status: 500 });
  }
}
