import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { JobStatus, WorkplaceType, JobType, ExperienceLevel, Prisma, Role } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const location = searchParams.get("location")?.trim() || "";
    const workplace = searchParams.get("workplace") as WorkplaceType | null;
    const jobType = searchParams.get("jobType") as JobType | null;
    const experience = searchParams.get("experience") as ExperienceLevel | null;
    const minSalary = searchParams.get("minSalary") ? parseInt(searchParams.get("minSalary")!) : null;
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "12")));
    const statusParam = searchParams.get("status") as JobStatus | null;

    const user = await getCurrentUser();

    const where: Prisma.JobWhereInput = {
      status: statusParam || JobStatus.PUBLISHED,
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { skills: { hasSome: [q] } },
        { company: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (workplace && Object.values(WorkplaceType).includes(workplace)) {
      where.workplaceType = workplace;
    }

    if (jobType && Object.values(JobType).includes(jobType)) {
      where.jobType = jobType;
    }

    if (experience && Object.values(ExperienceLevel).includes(experience)) {
      where.experienceLevel = experience;
    }

    if (minSalary && !isNaN(minSalary)) {
      where.salaryMax = { gte: minSalary };
    }

    let orderBy: Prisma.JobOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "salary_desc") {
      orderBy = { salaryMax: "desc" };
    } else if (sort === "views") {
      orderBy = { viewsCount: "desc" };
    } else if (sort === "oldest") {
      orderBy = { createdAt: "asc" };
    }

    const [total, jobs] = await Promise.all([
      prisma.job.count({ where }),
      prisma.job.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              location: true,
              isVerified: true,
              industry: true,
            },
          },
          savedBy: user?.id ? { where: { userId: user.id } } : false,
          applications: user?.id ? { where: { userId: user.id }, select: { id: true, status: true } } : false,
          _count: {
            select: {
              applications: true,
            },
          },
        },
      }),
    ]);

    const formattedJobs = jobs.map((job) => ({
      ...job,
      isSaved: user?.id ? job.savedBy && job.savedBy.length > 0 : false,
      userApplication: user?.id && job.applications && job.applications.length > 0 ? job.applications[0] : null,
      savedBy: undefined, // remove from response
    }));

    return NextResponse.json({
      success: true,
      jobs: formattedJobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== Role.RECRUITER && user.role !== Role.ADMIN)) {
      return NextResponse.json({ success: false, message: "Unauthorized. Recruiter access required." }, { status: 403 });
    }

    let companyId = user.recruiterProfile?.companyId;

    const body = await req.json();
    const {
      title,
      companyId: reqCompanyId,
      location,
      workplaceType = "ON_SITE",
      jobType = "FULL_TIME",
      experienceLevel = "MID_LEVEL",
      salaryMin,
      salaryMax,
      currency = "USD",
      description,
      responsibilities = [],
      requirements = [],
      benefits = [],
      skills = [],
      status = "PUBLISHED",
      deadline,
    } = body;

    if (!title || !description || !location) {
      return NextResponse.json(
        { success: false, message: "Title, description, and location are required." },
        { status: 400 }
      );
    }

    // If admin or recruiter with requested company
    if (reqCompanyId) {
      companyId = reqCompanyId;
    }

    if (!companyId) {
      // Find or create default company for recruiter
      const defaultCompany = await prisma.company.findFirst();
      if (!defaultCompany) {
        return NextResponse.json({ success: false, message: "No company associated with recruiter profile" }, { status: 400 });
      }
      companyId = defaultCompany.id;
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.random().toString(36).substring(2, 7)}`;

    const newJob = await prisma.$transaction(async (tx) => {
      const job = await tx.job.create({
        data: {
          title: title.trim(),
          slug,
          companyId: companyId!,
          recruiterId: user.id,
          location: location.trim(),
          workplaceType,
          jobType,
          experienceLevel,
          salaryMin: salaryMin ? parseInt(salaryMin) : null,
          salaryMax: salaryMax ? parseInt(salaryMax) : null,
          currency,
          description: description.trim(),
          responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
          requirements: Array.isArray(requirements) ? requirements : [],
          benefits: Array.isArray(benefits) ? benefits : [],
          skills: Array.isArray(skills) ? skills : [],
          status,
          deadline: deadline ? new Date(deadline) : null,
        },
      });

      if (Array.isArray(skills)) {
        for (const skill of skills) {
          if (skill && typeof skill === "string") {
            await tx.jobSkill.create({
              data: {
                jobId: job.id,
                name: skill.trim(),
              },
            });
          }
        }
      }

      return job;
    });

    return NextResponse.json({
      success: true,
      message: "Job posted successfully",
      job: newJob,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/jobs error:", error);
    return NextResponse.json({ success: false, message: "Failed to create job" }, { status: 500 });
  }
}
