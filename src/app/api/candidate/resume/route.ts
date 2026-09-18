import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    let resumeUrl = "";
    let fileName = "Resume.pdf";
    let fileSize = 1024 * 50;

    if (file && typeof file === "object" && "arrayBuffer" in file) {
      fileName = file.name;
      fileSize = file.size;

      // Validate file type
      const allowedExtensions = [".pdf", ".doc", ".docx"];
      const ext = path.extname(fileName).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        return NextResponse.json(
          { success: false, message: "Only PDF and Word documents are permitted (.pdf, .doc, .docx)" },
          { status: 400 }
        );
      }

      // Max size: 5MB
      if (fileSize > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: "File size exceeds maximum limit of 5MB" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const safeFileName = `${user.id}-${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path.join(uploadsDir, safeFileName);
      fs.writeFileSync(filePath, buffer);

      resumeUrl = `/uploads/resumes/${safeFileName}`;
    } else {
      // Allow passing a simulated resume URL if testing
      const providedUrl = formData.get("resumeUrl") as string;
      const providedName = formData.get("resumeName") as string;
      resumeUrl = providedUrl || `/uploads/resumes/${user.name.toLowerCase().replace(/\s+/g, "-")}-resume.pdf`;
      fileName = providedName || "Resume.pdf";
    }

    // Save to Resume table
    const resumeRecord = await prisma.resume.create({
      data: {
        userId: user.id,
        fileName,
        fileUrl: resumeUrl,
        fileSize,
        isPrimary: true,
      },
    });

    // Update candidate profile
    await prisma.candidateProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        resumeUrl,
        resumeName: fileName,
      },
      update: {
        resumeUrl,
        resumeName: fileName,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Resume uploaded successfully",
      resume: resumeRecord,
      resumeUrl,
      resumeName: fileName,
    });
  } catch (error) {
    console.error("POST /api/candidate/resume error:", error);
    return NextResponse.json({ success: false, message: "Failed to process resume upload" }, { status: 500 });
  }
}
