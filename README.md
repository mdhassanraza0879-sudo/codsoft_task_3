# CareerHub — Enterprise Recruitment & Job Portal
### CodSoft Full Stack Web Development Internship — Task 3

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18.4-336791?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.1-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**CareerHub** is an enterprise-grade recruitment platform designed and engineered for the **CodSoft Full Stack Web Development Internship (Task 3)**. Built from the ground up to mirror modern talent acquisition platforms like Ashby, Wellfound, and Greenhouse, CareerHub connects **Job Seekers**, **Recruiters/Employers**, and **Platform Administrators** in an integrated ecosystem with live Kanban applicant tracking, multi-facet search, and real-time status progressions.

---

## 🌟 Key Features

### 1. Job Seeker Experience
- **Faceted Job Search & Filtering**: Query by keyword, technical skill, workplace model (*Remote, Hybrid, On-site*), employment type (*Full-time, Part-time, Contract, Internship*), seniority (*Entry, Mid, Senior, Lead*), and minimum base salary slider.
- **Full Job Specifications**: Detailed responsibilities, requirements checklists, compensation disclosures, verified employer badges, and applicant count metrics.
- **1-Click Application Flow**: Submit tailored applications with pre-attached verified resume profiles and custom cover notes. Built-in duplicate application prevention.
- **Candidate Dashboard & Application Tracker**: Visual multi-stage progress bars tracking status across `Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Interview` ➔ `Hired` / `Rejected`, with recruiter feedback and evaluation notes.
- **Bookmarks**: Save open opportunities to your personal watchlist for later review.
- **Profile & Resume Builder**: Custom profile editor with skills tagger, resume upload/preview, and GitHub/portfolio linking.

### 2. Recruiter & Employer Suite
- **Interactive Kanban Recruitment Pipeline**: Visual 6-column ATS pipeline (`Applied`, `Under Review`, `Shortlisted`, `Interview`, `Rejected`, `Hired`) with stage transitions, direct resume inspection, and note attachments.
- **Recruiter KPI Dashboard**: Real-time analytics tracking active job counts, application volumes, screening backlogs, active interview rounds, and accepted offers.
- **Job Creator & Listing Manager**: Full CRUD job management with live publish/closed/draft status toggles and applicant counts.
- **Talent Discovery Pool**: Searchable candidate directory filtered by technical competencies, location, and verified profiles.
- **Employer Branding**: Customize company logos, about sections, company size, headquarters, websites, and verified badge indicators.

### 3. Visual Aesthetics & Orange Sunset Theme
- **Default Brand Palette (Vibrant Sunset Orange & Amber)**:
  - `--primary-50` to `--primary-950`: Electric orange (`#f97316`), deep radiant orange (`#ea580c`), warm amber (`#f59e0b`).
  - Warm, high-converting startup look (similar to Y Combinator, Postman, Substack, Zapier, Product Hunt).
- **Interactive Micro-Animations**:
  - `animate-float` & `animate-float-delayed`: Smooth 5s floating badges in the Hero section showing verified match rates and placement counts.
  - `animate-glow`: Ambient glowing sunset orbs in the hero background.
  - `hover-lift`: Smooth elevation (`translateY(-5px)`) and diffused orange shadows across featured jobs, hiring partner cards, and category items.
- **Top Demo Palette Switcher**: Real-time palette switcher in the header enabling 1-click toggling between:
  - 🟠 **Sunset Orange** (Default)
  - 🔵 **Sapphire Tech Blue**
  - 🟢 **Emerald Mint**
  - 🟣 **Royal Violet**

### 4. Administrative Governance Portal
- **Platform Analytics**: Total users, candidate/recruiter split, total listings, active jobs, and application volume audits.
- **User Permissions**: Manage user accounts, role delegations, and account status toggles (*Active / Suspended*).
- **Listing Moderation**: Inspect and moderate job postings across all organizations with status overrides and permanent removal.
- **Company Verification**: Grant or revoke verified trust badges to legitimate employer organizations.

### 4. Enterprise Security & Architecture
- **JWT Authentication**: Signed JSON Web Tokens stored in secure HTTP-only cookies with Edge Middleware route guards.
- **Role-Based Access Control (RBAC)**: Strict separation between Candidate, Recruiter, and Admin portals.
- **Password Security**: Strong salting and hashing powered by `bcryptjs`.
- **Database Integrity**: Relational PostgreSQL schema with foreign keys, cascading deletions, unique constraints, and compound indexes.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js (App Router, Server & Client Components), React, TypeScript |
| **Styling** | Tailwind CSS v4, Custom Design Tokens, Glassmorphism, Lucide Icons |
| **Backend** | Next.js API Route Handlers (REST), Node.js Runtime |
| **Database** | PostgreSQL 18.4 |
| **ORM** | Prisma ORM 6.4.1 |
| **Authentication** | JWT (JSON Web Tokens) with HTTP-only Cookies & `bcryptjs` |
| **Testing** | Automated End-to-End API Test Suite (`test-e2e.ts`) |

---

## 📂 Project Structure

```
codsoft_task_3/
├── prisma/
│   ├── schema.prisma          # PostgreSQL relational schema (10 models & enums)
│   └── seed.ts                # Enterprise seed script with realistic demo data
├── public/
│   └── uploads/resumes/       # Local resume storage & downloadable CVs
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/        # GET /api/health endpoint
│   │   │   ├── auth/          # register, login, logout, me, reset-password
│   │   │   ├── jobs/          # CRUD + search, filter, save, apply
│   │   │   ├── applications/  # List, details, status update, recruiter notes
│   │   │   ├── candidate/     # Profile and resume upload
│   │   │   ├── recruiter/     # Dashboard metrics, pipeline, talent search
│   │   │   └── admin/         # Dashboard metrics, user moderation, job moderation
│   │   ├── (auth)/
│   │   │   ├── login/         # Login with 1-click demo account buttons
│   │   │   ├── register/      # Candidate vs Recruiter registration
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── jobs/              # Job search, faceted filters, and job details (/jobs/[id])
│   │   ├── dashboard/         # Candidate dashboard with metrics & recommendations
│   │   ├── applications/      # Candidate application tracker with stage progress
│   │   ├── saved-jobs/        # Candidate bookmarked jobs
│   │   ├── profile/           # Candidate profile & resume editor
│   │   ├── recruiter/
│   │   │   ├── dashboard/     # Recruiter metrics & recent applicant stream
│   │   │   ├── jobs/          # Recruiter jobs manager & post form (/jobs/new)
│   │   │   ├── pipeline/      # Interactive Kanban recruitment board
│   │   │   ├── candidates/    # Candidate search talent pool
│   │   │   └── company/       # Organization profile editor
│   │   ├── admin/             # Admin master dashboard, user directory, moderation
│   │   ├── layout.tsx         # Root layout with Auth & Toast providers
│   │   ├── globals.css        # Tailwind styles & scrollbars
│   │   └── page.tsx           # Premium landing page with hero, search & partners
│   ├── components/
│   │   ├── layout/Navbar.tsx  # Dynamic navbar with live demo role switcher
│   │   ├── layout/Footer.tsx  # Footer with CodSoft internship specs
│   │   └── icons/SocialIcons.tsx # SVG icons
│   ├── context/
│   │   ├── AuthContext.tsx    # Session management & demo role switching
│   │   └── ToastContext.tsx   # Toast notification provider
│   ├── lib/
│   │   ├── auth.ts            # JWT signing, verification, bcrypt hashing
│   │   ├── prisma.ts          # Prisma Client singleton
│   │   └── utils.ts           # Formatters, badges, helpers
│   └── middleware.ts          # Edge middleware for RBAC protection
├── .env.example               # Environment variables template
├── package.json
└── tsconfig.json
```

---

## 🔑 Demo Accounts

For your convenience during evaluation and LinkedIn demo recording, 1-click login buttons are embedded on the `/login` screen and in the top header demo bar:

| Role | Email | Password | Organization / Description |
|---|---|---|---|
| **Admin** | `admin@careerhub.com` | `Admin@1234` | Platform Lead (Access to `/admin`) |
| **Recruiter** | `recruiter@techcorp.com` | `Recruiter@1234` | TechCorp Solutions (Access to `/recruiter/*`) |
| **Recruiter 2** | `hiring@nextgen.io` | `Recruiter@1234` | NextGen Dynamics |
| **Candidate 1** | `john.dev@example.com` | `Candidate@1234` | Senior Full Stack Engineer |
| **Candidate 2** | `sarah.ui@example.com` | `Candidate@1234` | Lead Product Designer |
| **Candidate 3** | `alex.cloud@example.com` | `Candidate@1234` | Cloud & DevOps Engineer |

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres@localhost:5432/careerhub_db?schema=public"
JWT_SECRET="careerhub_super_secret_jwt_key_983741893721_prod_2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🚀 Getting Started

### 1. Database Setup
Make sure PostgreSQL is running, then create the database:
```bash
# Using psql
psql -U postgres -c "CREATE DATABASE careerhub_db;"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Push Schema & Seed Database
```bash
# Push Prisma schema to PostgreSQL
npm run db:push

# Seed realistic companies, jobs, and candidates
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Start
```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

### 6. Run Automated E2E Test Suite
```bash
npx tsx test-e2e.ts
```

---

## 📡 REST API Overview

- `GET /api/health` — Returns `{ success: true, message: "CareerHub API is running" }`
- `POST /api/auth/register` — Register new Candidate or Recruiter
- `POST /api/auth/login` — Sign in and receive HTTP-only JWT session cookie
- `POST /api/auth/logout` — Invalidate session
- `GET /api/auth/me` — Retrieve active authenticated user profile
- `GET /api/jobs` — Search and filter jobs with pagination
- `GET /api/jobs/:id` — Job details with applicant count and view tracking
- `POST /api/jobs` — Publish a new job opening (Recruiter only)
- `PUT /api/jobs/:id` — Edit an existing job listing
- `DELETE /api/jobs/:id` — Remove a job posting
- `POST /api/jobs/:id/save` — Bookmark a job
- `DELETE /api/jobs/:id/save` — Remove job bookmark
- `POST /api/jobs/:id/apply` — Submit candidate application with duplicate check
- `GET /api/applications` — List applications (role-filtered)
- `PATCH /api/applications/:id/status` — Advance candidate stage in Kanban pipeline
- `POST /api/applications/:id/notes` — Attach recruiter evaluation note
- `GET /api/candidate/profile` — Fetch candidate profile details
- `PUT /api/candidate/profile` — Update candidate profile and skills
- `POST /api/candidate/resume` — Upload and attach candidate resume
- `GET /api/recruiter/dashboard` — Recruiter hiring KPIs
- `GET /api/recruiter/pipeline` — Kanban board structured candidate data
- `GET /api/recruiter/candidates` — Searchable candidate talent directory
- `GET /api/admin/dashboard` — Platform overview analytics
- `PATCH /api/admin/users/:id` — Toggle user active/suspended status
- `PATCH /api/admin/jobs/:id` — Moderate job listing status

---

## 📸 Screenshots (Demo Video Placeholder)

| Homepage & Search | Interactive Kanban Pipeline |
|:---:|:---:|
| Hero section with faceted search | 6-stage drag/advance candidate pipeline |

| Candidate Dashboard | Admin Governance |
|:---:|:---:|
| Live application progress tracking | Platform metrics and account management |

---

## 👨‍💻 Internship Submission Details
- **Internship**: CodSoft Full Stack Web Development Internship
- **Task Number**: Task 3 — Job Portal
- **Project**: CareerHub
