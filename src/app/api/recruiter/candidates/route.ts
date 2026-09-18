import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role, Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== Role.RECRUITER && user.role !== Role.ADMIN)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const skill = searchParams.get("skill")?.trim() || "";

    const where: Prisma.UserWhereInput = {
      role: Role.CANDIDATE,
      isActive: true,
      candidateProfile: skill
        ? {
            is: {
              skills: { has: skill },
            },
          }
        : {
            isNot: null,
          },
    };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { candidateProfile: { headline: { contains: q, mode: "insensitive" } } },
        { candidateProfile: { location: { contains: q, mode: "insensitive" } } },
      ];
    }

    const candidates = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        candidateProfile: true,
        resumes: {
          where: { isPrimary: true },
          take: 1,
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      candidates,
    });
  } catch (error) {
    console.error("GET /api/recruiter/candidates error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch candidates" }, { status: 500 });
  }
}
