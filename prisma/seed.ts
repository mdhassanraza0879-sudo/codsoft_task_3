import { PrismaClient, Role, JobType, WorkplaceType, ExperienceLevel, ApplicationStatus, JobStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CareerHub database seeding...");

  // Clean existing records in reverse dependency order
  await prisma.recruiterNote.deleteMany();
  await prisma.application.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.jobSkill.deleteMany();
  await prisma.job.deleteMany();
  await prisma.recruiterProfile.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  const hashedAdminPassword = await bcrypt.hash("Admin@1234", 10);
  const hashedRecruiterPassword = await bcrypt.hash("Recruiter@1234", 10);
  const hashedCandidatePassword = await bcrypt.hash("Candidate@1234", 10);

  // 1. Create Platform Admin
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@careerhub.com",
      passwordHash: hashedAdminPassword,
      name: "Eleanor Vance (Admin)",
      role: Role.ADMIN,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    },
  });

  // 2. Create Companies
  const techCorp = await prisma.company.create({
    data: {
      name: "TechCorp Solutions",
      slug: "techcorp-solutions",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
      website: "https://techcorp-example.com",
      industry: "Enterprise Cloud & AI",
      size: "500-1000 employees",
      location: "San Francisco, CA (HQ)",
      about: "TechCorp Solutions is a world-class engineering leader pioneering high-throughput cloud platforms, distributed architectures, and generative enterprise AI solutions.",
      linkedin: "https://linkedin.com/company/techcorp-solutions",
      twitter: "https://twitter.com/techcorpsol",
      isVerified: true,
    },
  });

  const nextGen = await prisma.company.create({
    data: {
      name: "NextGen Dynamics",
      slug: "nextgen-dynamics",
      logo: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=200&auto=format&fit=crop&q=80",
      website: "https://nextgendynamics-example.io",
      industry: "Fintech & Algorithmic Trading",
      size: "100-250 employees",
      location: "New York, NY",
      about: "NextGen Dynamics powers modern financial infrastructure, sub-millisecond trading systems, and ultra-secure transactional banking platforms.",
      linkedin: "https://linkedin.com/company/nextgen-dynamics",
      isVerified: true,
    },
  });

  const cloudScale = await prisma.company.create({
    data: {
      name: "CloudScale Labs",
      slug: "cloudscale-labs",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=80",
      website: "https://cloudscalelabs-example.com",
      industry: "DevOps & Cloud Infrastructure",
      size: "50-100 employees",
      location: "Seattle, WA",
      about: "CloudScale Labs delivers developer-first platform engineering tools, Kubernetes management automation, and zero-trust observability frameworks.",
      linkedin: "https://linkedin.com/company/cloudscale-labs",
      isVerified: true,
    },
  });

  const apexCreative = await prisma.company.create({
    data: {
      name: "Apex Creative",
      slug: "apex-creative",
      logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80",
      website: "https://apexcreative-example.design",
      industry: "Design Systems & Digital UX",
      size: "20-50 employees",
      location: "Austin, TX",
      about: "Apex Creative is an award-winning digital experience studio crafting delightful web, mobile, and design system experiences for Fortune 500 innovators.",
      linkedin: "https://linkedin.com/company/apex-creative",
      isVerified: false,
    },
  });

  const bioHealth = await prisma.company.create({
    data: {
      name: "BioHealth Data",
      slug: "biohealth-data",
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=80",
      website: "https://biohealth-example.org",
      industry: "HealthTech & Clinical AI",
      size: "250-500 employees",
      location: "Boston, MA",
      about: "Accelerating healthcare diagnostics and clinical trials using deep learning on multi-omics data.",
      isVerified: true,
    },
  });

  // 3. Create Recruiters
  const recruiter1User = await prisma.user.create({
    data: {
      email: "recruiter@techcorp.com",
      passwordHash: hashedRecruiterPassword,
      name: "Marcus Sterling",
      role: Role.RECRUITER,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      recruiterProfile: {
        create: {
          companyId: techCorp.id,
          position: "Head of Talent Acquisition",
          department: "People & Talent Operations",
        },
      },
    },
  });

  const recruiter2User = await prisma.user.create({
    data: {
      email: "hiring@nextgen.io",
      passwordHash: hashedRecruiterPassword,
      name: "Samantha Wright",
      role: Role.RECRUITER,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      recruiterProfile: {
        create: {
          companyId: nextGen.id,
          position: "Senior Technical Recruiter",
          department: "Engineering Recruitment",
        },
      },
    },
  });

  const recruiter3User = await prisma.user.create({
    data: {
      email: "talent@cloudscale.co",
      passwordHash: hashedRecruiterPassword,
      name: "David Chen",
      role: Role.RECRUITER,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      recruiterProfile: {
        create: {
          companyId: cloudScale.id,
          position: "Talent Partner",
          department: "HR",
        },
      },
    },
  });

  // 4. Create Candidates
  const candidateJohn = await prisma.user.create({
    data: {
      email: "john.dev@example.com",
      passwordHash: hashedCandidatePassword,
      name: "Johnathan Doe",
      role: Role.CANDIDATE,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
      candidateProfile: {
        create: {
          headline: "Senior Full Stack Engineer | React, Node.js & TypeScript",
          bio: "Passionate software engineer with 5+ years building scalable distributed web apps, GraphQL/REST APIs, and reactive frontend experiences. Enthusiastic about clean code and performance optimization.",
          phone: "+1 (555) 234-5678",
          location: "San Francisco, CA (Remote Friendly)",
          skills: ["TypeScript", "Next.js", "React", "Node.js", "PostgreSQL", "Docker", "Tailwind CSS", "Prisma", "AWS"],
          resumeUrl: "/uploads/resumes/john-doe-resume.pdf",
          resumeName: "John_Doe_Senior_FullStack_Resume.pdf",
          portfolio: "https://johndoe.dev",
          github: "https://github.com/johndoe-dev",
          linkedin: "https://linkedin.com/in/johndoe-dev",
          experience: [
            {
              title: "Senior Software Engineer",
              company: "StreamFlow Media",
              duration: "2023 - Present",
              description: "Spearheaded frontend migration to Next.js App Router, improved Core Web Vitals by 42%, and maintained microservices in Node.js/PostgreSQL handling 3M requests daily.",
            },
            {
              title: "Full Stack Developer",
              company: "ByteCraft Labs",
              duration: "2021 - 2023",
              description: "Designed RESTful APIs in Express/TypeScript and built real-time analytics dashboards using React, Redux, and Tailwind CSS.",
            },
          ],
          education: [
            {
              degree: "B.S. in Computer Science",
              institution: "University of California, Berkeley",
              year: "2017 - 2021",
            },
          ],
        },
      },
    },
  });

  const candidateSarah = await prisma.user.create({
    data: {
      email: "sarah.ui@example.com",
      passwordHash: hashedCandidatePassword,
      name: "Sarah Jenkins",
      role: Role.CANDIDATE,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      candidateProfile: {
        create: {
          headline: "Staff Product Designer & Design Systems Architect",
          bio: "Crafting human-centered digital experiences and scalable multi-brand design systems for 6+ years. Expert in Figma, micro-interactions, prototyping, and accessibility.",
          phone: "+1 (555) 876-5432",
          location: "Austin, TX",
          skills: ["Figma", "UI/UX Design", "Design Systems", "Prototyping", "User Research", "Wireframing", "CSS3", "Design Tokens"],
          resumeUrl: "/uploads/resumes/sarah-jenkins-resume.pdf",
          resumeName: "Sarah_Jenkins_Design_Resume.pdf",
          portfolio: "https://sarahjenkins.design",
          linkedin: "https://linkedin.com/in/sarahjenkins-design",
          experience: [
            {
              title: "Lead Product Designer",
              company: "Prism Creative Studios",
              duration: "2022 - Present",
              description: "Created comprehensive design tokens library serving 14 consumer web applications and established user testing workflows.",
            },
          ],
          education: [
            {
              degree: "B.F.A. in Digital Arts & Interaction Design",
              institution: "Rhode Island School of Design",
              year: "2016 - 2020",
            },
          ],
        },
      },
    },
  });

  const candidateAlex = await prisma.user.create({
    data: {
      email: "alex.cloud@example.com",
      passwordHash: hashedCandidatePassword,
      name: "Alex Rivera",
      role: Role.CANDIDATE,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
      candidateProfile: {
        create: {
          headline: "Cloud & DevOps Engineer | Kubernetes, Terraform, AWS",
          bio: "Specializing in resilient CI/CD pipelines, GitOps, zero-downtime deployments, and AWS multi-region infrastructure.",
          phone: "+1 (555) 345-9876",
          location: "Seattle, WA",
          skills: ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD", "Prometheus", "Grafana", "Go", "Python"],
          resumeUrl: "/uploads/resumes/alex-rivera-resume.pdf",
          resumeName: "Alex_Rivera_DevOps_Resume.pdf",
          portfolio: "https://alexrivera.cloud",
          github: "https://github.com/alexrivera-ops",
          experience: [
            {
              title: "DevOps Engineer",
              company: "CloudMatrix Inc.",
              duration: "2021 - Present",
              description: "Automated multi-tenant EKS cluster provisioning with Terraform and implemented blue/green deployments.",
            },
          ],
          education: [
            {
              degree: "B.S. in Computer Engineering",
              institution: "University of Washington",
              year: "2017 - 2021",
            },
          ],
        },
      },
    },
  });

  // 5. Create Job Listings
  const job1 = await prisma.job.create({
    data: {
      title: "Senior Full Stack Engineer (Next.js & Node.js)",
      slug: "senior-full-stack-engineer-nextjs-node",
      companyId: techCorp.id,
      recruiterId: recruiter1User.id,
      location: "San Francisco, CA",
      workplaceType: WorkplaceType.HYBRID,
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.SENIOR_LEVEL,
      salaryMin: 140000,
      salaryMax: 175000,
      currency: "USD",
      description: "We are seeking a seasoned Senior Full Stack Engineer to spearhead core product engineering at TechCorp. You will drive architecture for high-volume customer-facing portals, implement robust APIs, and collaborate closely with product and design teams.",
      responsibilities: [
        "Architect and implement modern web applications using Next.js, React, and TypeScript",
        "Build resilient, high-throughput microservices in Node.js and PostgreSQL",
        "Lead code reviews, mentor junior engineers, and enforce software quality best practices",
        "Partner with UX designers to deliver pixel-perfect, accessible user interfaces",
      ],
      requirements: [
        "5+ years of production experience in TypeScript, React, and Node.js",
        "Demonstrated mastery of relational databases (PostgreSQL) and ORMs (Prisma)",
        "Experience with cloud architectures (AWS/GCP), Docker containerization, and CI/CD",
        "Excellent communication and problem-solving skills in collaborative agile squads",
      ],
      benefits: [
        "Competitive base salary + comprehensive equity package",
        "100% employer-covered Medical, Dental, and Vision insurance",
        "$3,000 annual learning & conference stipend",
        "Flexible hybrid schedule (2 days in office, 3 days remote)",
        "401(k) with 5% immediate company match",
      ],
      skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "AWS"],
      status: JobStatus.PUBLISHED,
      viewsCount: 428,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: "Lead UI/UX Product Designer",
      slug: "lead-ui-ux-product-designer",
      companyId: techCorp.id,
      recruiterId: recruiter1User.id,
      location: "San Francisco, CA",
      workplaceType: WorkplaceType.REMOTE,
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.LEAD,
      salaryMin: 150000,
      salaryMax: 185000,
      currency: "USD",
      description: "TechCorp is looking for a visionary Lead Product Designer to guide our digital design systems and customer journey touchpoints across all flagship enterprise products.",
      responsibilities: [
        "Define design strategy, visual design language, and design token hierarchies",
        "Create end-to-end interactive prototypes and high-fidelity Figma components",
        "Conduct customer research, usability tests, and quantitative interaction analysis",
        "Collaborate daily with frontend engineers to ensure design fidelity in code",
      ],
      requirements: [
        "6+ years designing enterprise SaaS or complex consumer applications",
        "Deep portfolio demonstrating end-to-end product design, UX flows, and design systems",
        "Expertise in Figma, Tokens Studio, and component variant management",
        "Solid understanding of HTML5/CSS3 accessibility (WCAG 2.1 AA)",
      ],
      benefits: [
        "Unlimited Paid Time Off (PTO) with required minimum 3 weeks",
        "Home office setup budget ($2,500)",
        "Comprehensive health & wellness coverage",
        "Annual team offsites in premier global destinations",
      ],
      skills: ["Figma", "UI/UX Design", "Design Systems", "Prototyping", "User Research", "Wireframing"],
      status: JobStatus.PUBLISHED,
      viewsCount: 312,
    },
  });

  const job3 = await prisma.job.create({
    data: {
      title: "Senior Backend / Distributed Systems Engineer",
      slug: "senior-backend-distributed-systems-engineer",
      companyId: nextGen.id,
      recruiterId: recruiter2User.id,
      location: "New York, NY",
      workplaceType: WorkplaceType.HYBRID,
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.SENIOR_LEVEL,
      salaryMin: 165000,
      salaryMax: 210000,
      currency: "USD",
      description: "Join NextGen Dynamics in developing low-latency transactional execution engines. You will design fault-tolerant systems handling millions of financial operations with precision and speed.",
      responsibilities: [
        "Develop high-performance streaming services and event-driven data architectures",
        "Optimize SQL queries, transaction isolation levels, and indexing strategies in PostgreSQL",
        "Implement robust observability, tracing, and automated fault recovery systems",
      ],
      requirements: [
        "Strong experience with Go, Node.js, or Rust in mission-critical environments",
        "In-depth knowledge of PostgreSQL, Redis, Kafka, or RabbitMQ",
        "Understanding of distributed consensus, ACID guarantees, and caching algorithms",
      ],
      benefits: [
        "Top-of-market base salary + discretionary annual performance bonus",
        "Premium health benefits with executive wellness packages",
        "Full transit subsidy and catered gourmet lunches daily",
      ],
      skills: ["Node.js", "PostgreSQL", "Redis", "Kafka", "Docker", "Microservices"],
      status: JobStatus.PUBLISHED,
      viewsCount: 520,
    },
  });

  const job4 = await prisma.job.create({
    data: {
      title: "DevOps & Cloud Platform Specialist",
      slug: "devops-cloud-platform-specialist",
      companyId: cloudScale.id,
      recruiterId: recruiter3User.id,
      location: "Seattle, WA",
      workplaceType: WorkplaceType.REMOTE,
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.MID_LEVEL,
      salaryMin: 125000,
      salaryMax: 155000,
      currency: "USD",
      description: "Help CloudScale Labs build autonomous deployment platforms. We are looking for an engineer with enthusiasm for container orchestration, Terraform infrastructure-as-code, and GitOps workflows.",
      responsibilities: [
        "Manage and optimize multi-region Kubernetes clusters across AWS",
        "Build secure CI/CD pipelines in GitHub Actions with automated scanning",
        "Implement telemetry dashboards with Prometheus, Grafana, and OpenTelemetry",
      ],
      requirements: [
        "3+ years managing production Kubernetes, Docker, and AWS resources",
        "Proficiency in Terraform, Helm, and shell scripting",
        "Experience configuring secure networks (VPC, IAM, SSL/TLS, firewalls)",
      ],
      benefits: [
        "100% remote work flexibility from anywhere in the US or Canada",
        "Generous tech equipment allowance and monthly internet reimbursement",
        "Health, vision, and dental coverage for you and your dependents",
      ],
      skills: ["Kubernetes", "AWS", "Terraform", "Docker", "CI/CD", "Linux"],
      status: JobStatus.PUBLISHED,
      viewsCount: 289,
    },
  });

  const job5 = await prisma.job.create({
    data: {
      title: "Frontend Developer (React & TypeScript)",
      slug: "frontend-developer-react-typescript",
      companyId: apexCreative.id,
      recruiterId: recruiter1User.id,
      location: "Austin, TX",
      workplaceType: WorkplaceType.REMOTE,
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.MID_LEVEL,
      salaryMin: 105000,
      salaryMax: 135000,
      currency: "USD",
      description: "Apex Creative needs a talented Frontend Developer who loves micro-interactions, responsive CSS layouts, and modern React architectures.",
      responsibilities: [
        "Translate Figma prototypes into buttery-smooth React components",
        "Ensure fast page load times and WCAG 2.1 compliance",
        "Maintain internal UI component libraries and documentation",
      ],
      requirements: [
        "3+ years building responsive frontends with React and TypeScript",
        "Strong understanding of modern CSS (Tailwind, CSS Grid, Flexbox, transitions)",
        "Experience consuming REST and GraphQL endpoints",
      ],
      benefits: [
        "Flexible working hours across all US timezones",
        "Annual team creative retreat",
        "Comprehensive health & wellness coverage",
      ],
      skills: ["React", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "JavaScript"],
      status: JobStatus.PUBLISHED,
      viewsCount: 390,
    },
  });

  const job6 = await prisma.job.create({
    data: {
      title: "Senior Product Manager — Developer Platform",
      slug: "senior-product-manager-developer-platform",
      companyId: techCorp.id,
      recruiterId: recruiter1User.id,
      location: "San Francisco, CA",
      workplaceType: WorkplaceType.HYBRID,
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.SENIOR_LEVEL,
      salaryMin: 155000,
      salaryMax: 190000,
      currency: "USD",
      description: "Lead product discovery and roadmap execution for TechCorp's developer API ecosystem. Work at the intersection of technical architecture, developer experience, and business strategy.",
      responsibilities: [
        "Define product vision and quarterly OKRs for cloud platform APIs",
        "Gather requirements from customer engineering teams and internal stakeholders",
        "Write detailed PRDs, user stories, and acceptance criteria",
      ],
      requirements: [
        "4+ years of product management experience for B2B SaaS or developer tools",
        "Background in software development or computer science preferred",
        "Demonstrated ability to drive cross-functional engineering execution",
      ],
      benefits: [
        "Robust equity incentives",
        "Full medical coverage and family health plans",
        "Executive leadership coaching and development programs",
      ],
      skills: ["Product Management", "Agile", "API Design", "User Research", "Roadmapping"],
      status: JobStatus.PUBLISHED,
      viewsCount: 260,
    },
  });

  const job7 = await prisma.job.create({
    data: {
      title: "Clinical Data Analyst & ML Engineer",
      slug: "clinical-data-analyst-ml-engineer",
      companyId: bioHealth.id,
      recruiterId: recruiter2User.id,
      location: "Boston, MA",
      workplaceType: WorkplaceType.ON_SITE,
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.MID_LEVEL,
      salaryMin: 115000,
      salaryMax: 145000,
      currency: "USD",
      description: "Analyze complex biometric datasets and train predictive diagnostic models to transform clinical patient workflows.",
      responsibilities: [
        "Develop statistical models and machine learning pipelines in Python/PyTorch",
        "Extract insights from healthcare data warehouses and build interactive BI dashboards",
        "Ensure HIPAA compliance and data integrity across all analytical models",
      ],
      requirements: [
        "Degree in Data Science, Statistics, Computer Science, or related discipline",
        "Proficiency in Python, SQL, Pandas, Scikit-learn, and Tableau/PowerBI",
        "Experience handling health or clinical datasets is a plus",
      ],
      benefits: [
        "Direct impact on patient outcomes and lifesaving clinical technology",
        "Competitive salary and performance bonuses",
        "Comprehensive health insurance and tuition assistance",
      ],
      skills: ["Python", "SQL", "Machine Learning", "Data Analysis", "Statistics"],
      status: JobStatus.PUBLISHED,
      viewsCount: 195,
    },
  });

  const job8 = await prisma.job.create({
    data: {
      title: "Full Stack Intern (Summer 2026)",
      slug: "full-stack-intern-summer-2026",
      companyId: techCorp.id,
      recruiterId: recruiter1User.id,
      location: "San Francisco, CA",
      workplaceType: WorkplaceType.HYBRID,
      jobType: JobType.INTERNSHIP,
      experienceLevel: ExperienceLevel.ENTRY_LEVEL,
      salaryMin: 45000,
      salaryMax: 65000,
      currency: "USD",
      description: "Gain direct hands-on experience building production features with our core web platform team. Mentorship provided by senior staff engineers.",
      responsibilities: [
        "Develop frontend components and backend endpoints under guidance",
        "Participate in daily standups, sprint planning, and team code reviews",
        "Deliver an impactful end-of-summer capstone presentation",
      ],
      requirements: [
        "Currently pursuing a degree in Computer Science, Software Engineering, or equivalent",
        "Familiarity with JavaScript/TypeScript, React, and basic database concepts",
        "Eagerness to learn, ask questions, and collaborate",
      ],
      benefits: [
        "Competitive hourly stipend + housing assistance",
        "Direct 1-on-1 mentorship with principal engineers",
        "Potential fast-track offer for full-time graduate role",
      ],
      skills: ["JavaScript", "TypeScript", "React", "Node.js", "Git"],
      status: JobStatus.PUBLISHED,
      viewsCount: 650,
    },
  });

  // Populate JobSkill records for relational search
  const allJobs = [job1, job2, job3, job4, job5, job6, job7, job8];
  for (const job of allJobs) {
    for (const skill of job.skills) {
      await prisma.jobSkill.create({
        data: {
          jobId: job.id,
          name: skill,
        },
      });
    }
  }

  // 6. Create Realistic Candidate Applications across Pipeline Stages
  // Pipeline: APPLIED -> UNDER_REVIEW -> SHORTLISTED -> INTERVIEW -> REJECTED -> HIRED

  // John applied to TechCorp Senior Full Stack (Job 1) -> INTERVIEW
  const app1 = await prisma.application.create({
    data: {
      jobId: job1.id,
      userId: candidateJohn.id,
      resumeUrl: "/uploads/resumes/john-doe-resume.pdf",
      coverLetter: "Dear Hiring Team at TechCorp,\n\nI am thrilled to apply for the Senior Full Stack Engineer position. Having spent 5 years scaling Next.js and Node.js microservices, I know I can contribute immediately to your enterprise AI platform. My previous role involved cutting latency by 42% and building intuitive user interfaces. I would welcome the opportunity to discuss how my skill set aligns with your architectural roadmap.\n\nBest regards,\nJohnathan Doe",
      status: ApplicationStatus.INTERVIEW,
    },
  });

  // Add Recruiter Notes to App 1
  await prisma.recruiterNote.create({
    data: {
      applicationId: app1.id,
      authorId: recruiter1User.id,
      content: "Excellent technical portfolio. Code samples in Next.js App Router demonstrate senior-level mastery. Technical screen completed with flying colors. Advancing to System Design Interview on Monday.",
    },
  });

  // John applied to NextGen Backend (Job 3) -> SHORTLISTED
  await prisma.application.create({
    data: {
      jobId: job3.id,
      userId: candidateJohn.id,
      resumeUrl: "/uploads/resumes/john-doe-resume.pdf",
      coverLetter: "Hi Samantha,\n\nI have extensive experience tuning PostgreSQL query planners and building resilient Node.js services. I am very interested in NextGen's high-frequency trading infrastructure.",
      status: ApplicationStatus.SHORTLISTED,
    },
  });

  // Sarah applied to Lead UI/UX Designer (Job 2) -> HIRED!
  const appSarah = await prisma.application.create({
    data: {
      jobId: job2.id,
      userId: candidateSarah.id,
      resumeUrl: "/uploads/resumes/sarah-jenkins-resume.pdf",
      coverLetter: "Hi Marcus,\n\nWith over 6 years crafting scalable design systems in Figma and advocating for inclusive UX, I was captivated by TechCorp's mission. I look forward to leading your design strategy.",
      status: ApplicationStatus.HIRED,
    },
  });

  await prisma.recruiterNote.create({
    data: {
      applicationId: appSarah.id,
      authorId: recruiter1User.id,
      content: "Unanimous 'Strong Hire' from design team and VP of Engineering. Offer letter extended and accepted! Start date: Next month.",
    },
  });

  // Sarah applied to Frontend Developer (Job 5) -> UNDER_REVIEW
  await prisma.application.create({
    data: {
      jobId: job5.id,
      userId: candidateSarah.id,
      resumeUrl: "/uploads/resumes/sarah-jenkins-resume.pdf",
      coverLetter: "Excited to bring both design system craft and clean React code to Apex Creative!",
      status: ApplicationStatus.UNDER_REVIEW,
    },
  });

  // Alex applied to DevOps Specialist (Job 4) -> INTERVIEW
  const appAlex = await prisma.application.create({
    data: {
      jobId: job4.id,
      userId: candidateAlex.id,
      resumeUrl: "/uploads/resumes/alex-rivera-resume.pdf",
      coverLetter: "Hi David,\n\nI have operated multi-tenant Kubernetes on AWS for 3+ years and written extensive Terraform automation. I would love to contribute to CloudScale's developer platform.",
      status: ApplicationStatus.INTERVIEW,
    },
  });

  await prisma.recruiterNote.create({
    data: {
      applicationId: appAlex.id,
      authorId: recruiter3User.id,
      content: "Passed initial technical screening. Excellent grasp of Kubernetes networking and Terraform modules. Scheduling final round with Lead Platform Architect.",
    },
  });

  // Saved Jobs for John Doe
  await prisma.savedJob.create({
    data: {
      jobId: job2.id,
      userId: candidateJohn.id,
    },
  });

  await prisma.savedJob.create({
    data: {
      jobId: job4.id,
      userId: candidateJohn.id,
    },
  });

  // Saved Jobs for Sarah Jenkins
  await prisma.savedJob.create({
    data: {
      jobId: job1.id,
      userId: candidateSarah.id,
    },
  });

  console.log("✅ CareerHub database successfully seeded with realistic enterprise data!");
  console.log("------------------------------------------------------------------------");
  console.log("Demo Accounts Available:");
  console.log("1. Admin:      admin@careerhub.com      / Admin@1234");
  console.log("2. Recruiter:  recruiter@techcorp.com   / Recruiter@1234");
  console.log("3. Recruiter:  hiring@nextgen.io        / Recruiter@1234");
  console.log("4. Candidate:  john.dev@example.com     / Candidate@1234");
  console.log("5. Candidate:  sarah.ui@example.com     / Candidate@1234");
  console.log("6. Candidate:  alex.cloud@example.com   / Candidate@1234");
  console.log("------------------------------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
