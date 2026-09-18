import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role, Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") as Role | null;
    const q = searchParams.get("q")?.trim();

    const where: Prisma.UserWhereInput = {};
    if (role && Object.values(Role).includes(role)) {
      where.role = role;
    }
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            applications: true,
            postedJobs: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 });
  }
}
