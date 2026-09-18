import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const companies = await prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            jobs: true,
            recruiters: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, companies });
  } catch (error) {
    console.error("GET /api/admin/companies error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch companies" }, { status: 500 });
  }
}
