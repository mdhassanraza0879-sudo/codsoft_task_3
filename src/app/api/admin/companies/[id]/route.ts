import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";

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

    const { isVerified } = await req.json();

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: { isVerified: Boolean(isVerified) },
    });

    return NextResponse.json({
      success: true,
      message: `Company ${isVerified ? "verified" : "unverified"} successfully`,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("PATCH /api/admin/companies/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update company" }, { status: 500 });
  }
}
