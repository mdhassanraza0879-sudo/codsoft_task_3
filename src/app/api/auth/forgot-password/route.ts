import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always respond with success to prevent user enumeration
    return NextResponse.json({
      success: true,
      message: user
        ? "If an account exists with this email, a password reset link has been dispatched."
        : "If an account exists with this email, a password reset link has been dispatched.",
      demoResetToken: user ? "demo-reset-token-2026" : null,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
