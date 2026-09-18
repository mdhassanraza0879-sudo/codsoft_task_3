import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role = "CANDIDATE", companyName } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Role protection: Public cannot register as ADMIN directly
    let userRole: Role = Role.CANDIDATE;
    if (role === "RECRUITER") {
      userRole = Role.RECRUITER;
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create User transactionally with corresponding profile
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          passwordHash,
          role: userRole,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`,
        },
      });

      if (userRole === Role.CANDIDATE) {
        await tx.candidateProfile.create({
          data: {
            userId: user.id,
            headline: "Software Professional",
            skills: [],
          },
        });
      } else if (userRole === Role.RECRUITER) {
        let compId: string | null = null;
        if (companyName && companyName.trim()) {
          const compSlug = companyName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          let comp = await tx.company.findUnique({
            where: { slug: compSlug },
          });

          if (!comp) {
            comp = await tx.company.create({
              data: {
                name: companyName.trim(),
                slug: `${compSlug}-${Math.random().toString(36).substring(2, 6)}`,
                about: `Innovative enterprise team at ${companyName}`,
              },
            });
          }
          compId = comp.id;
        }

        await tx.recruiterProfile.create({
          data: {
            userId: user.id,
            companyId: compId,
            position: "Talent Partner",
          },
        });
      }

      return user;
    });

    // Generate JWT token
    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
        },
      },
      { status: 201 }
    );

    // Set HTTP-only auth cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during registration" },
      { status: 500 }
    );
  }
}
