import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== Role.RECRUITER && user.role !== Role.ADMIN)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const companyId = user.recruiterProfile?.companyId;
    if (!companyId) {
      return NextResponse.json({ success: true, company: null });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        _count: {
          select: {
            jobs: true,
            recruiters: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, company });
  } catch (error) {
    console.error("GET /api/recruiter/company error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch company profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== Role.RECRUITER && user.role !== Role.ADMIN)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, logo, website, industry, size, location, about, linkedin, twitter } = body;

    let companyId = user.recruiterProfile?.companyId;

    let updatedCompany;
    if (companyId) {
      updatedCompany = await prisma.company.update({
        where: { id: companyId },
        data: {
          ...(name && { name: name.trim() }),
          ...(logo !== undefined && { logo }),
          ...(website !== undefined && { website }),
          ...(industry !== undefined && { industry }),
          ...(size !== undefined && { size }),
          ...(location !== undefined && { location }),
          ...(about !== undefined && { about }),
          ...(linkedin !== undefined && { linkedin }),
          ...(twitter !== undefined && { twitter }),
        },
      });
    } else {
      const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.random().toString(36).substring(2, 6)}`;
      updatedCompany = await prisma.company.create({
        data: {
          name: name || "My Company",
          slug,
          logo,
          website,
          industry,
          size,
          location,
          about,
          linkedin,
          twitter,
        },
      });

      await prisma.recruiterProfile.update({
        where: { userId: user.id },
        data: { companyId: updatedCompany.id },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Company profile updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("PUT /api/recruiter/company error:", error);
    return NextResponse.json({ success: false, message: "Failed to update company profile" }, { status: 500 });
  }
}
