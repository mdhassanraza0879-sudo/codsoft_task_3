import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("GET /api/candidate/profile error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch candidate profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      headline,
      bio,
      phone,
      location,
      skills,
      experience,
      education,
      portfolio,
      github,
      linkedin,
      resumeUrl,
      resumeName,
    } = body;

    // Update User name if provided
    if (name && name.trim() && name !== user.name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: name.trim() },
      });
    }

    // Upsert CandidateProfile
    const profile = await prisma.candidateProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        headline,
        bio,
        phone,
        location,
        skills: Array.isArray(skills) ? skills : [],
        experience,
        education,
        portfolio,
        github,
        linkedin,
        resumeUrl,
        resumeName,
      },
      update: {
        headline,
        bio,
        phone,
        location,
        skills: Array.isArray(skills) ? skills : [],
        experience,
        education,
        portfolio,
        github,
        linkedin,
        resumeUrl,
        resumeName,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("PUT /api/candidate/profile error:", error);
    return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 });
  }
}
