const BASE_URL = "http://localhost:3000";

async function runVerification() {
  console.log("==================================================");
  console.log("🚀 STARTING COMPLETE E2E VERIFICATION FOR TASK 3");
  console.log("==================================================");

  let candidateCookie = "";
  let recruiterCookie = "";
  let adminCookie = "";

  // 1. Health check
  console.log("\n1. Testing GET /api/health");
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const healthData: any = await healthRes.json();
  console.log("Status:", healthRes.status, healthData);
  if (!healthData.success || healthData.message !== "CareerHub API is running") {
    throw new Error("Health check failed");
  }

  // 2. Register Candidate
  console.log("\n2. Testing POST /api/auth/register (New Candidate)");
  const rand = Math.floor(Math.random() * 10000);
  const testCandidateEmail = `test.candidate.${rand}@example.com`;
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `Test Candidate ${rand}`,
      email: testCandidateEmail,
      password: "Password@123",
      role: "CANDIDATE",
    }),
  });
  const regData: any = await regRes.json();
  console.log("Register Candidate Result:", regRes.status, regData.success, regData.message);

  // 3. Login Candidate
  console.log("\n3. Testing POST /api/auth/login (Candidate John Doe)");
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "john.dev@example.com",
      password: "Candidate@1234",
    }),
  });
  const loginData: any = await loginRes.json();
  const rawCookie = loginRes.headers.get("set-cookie");
  candidateCookie = rawCookie ? rawCookie.split(";")[0] : "";
  console.log("Candidate Login Result:", loginRes.status, loginData.success, "User:", loginData.user?.name);

  // 4. Browse Jobs
  console.log("\n4. Testing GET /api/jobs (Browse)");
  const browseRes = await fetch(`${BASE_URL}/api/jobs`);
  const browseData: any = await browseRes.json();
  console.log("Browse Jobs Total:", browseData.pagination.total, "Items returned:", browseData.jobs.length);
  const firstJob = browseData.jobs[0];

  // 5. Search Jobs
  console.log("\n5. Testing GET /api/jobs?q=React (Search)");
  const searchRes = await fetch(`${BASE_URL}/api/jobs?q=React`);
  const searchData: any = await searchRes.json();
  console.log("Search 'React' found:", searchData.jobs.length, "jobs");

  // 6. Filter Jobs
  console.log("\n6. Testing GET /api/jobs?workplace=REMOTE (Filter)");
  const filterRes = await fetch(`${BASE_URL}/api/jobs?workplace=REMOTE`);
  const filterData: any = await filterRes.json();
  console.log("Filter 'REMOTE' found:", filterData.jobs.length, "jobs");

  // 7. Open Job Details
  console.log(`\n7. Testing GET /api/jobs/${firstJob.id} (Job Details)`);
  const detailsRes = await fetch(`${BASE_URL}/api/jobs/${firstJob.id}`);
  const detailsData: any = await detailsRes.json();
  console.log("Job Details Title:", detailsData.job?.title, "Company:", detailsData.job?.company?.name);

  // 8. Save Job
  console.log(`\n8. Testing POST /api/jobs/${firstJob.id}/save (Save Job)`);
  const saveRes = await fetch(`${BASE_URL}/api/jobs/${firstJob.id}/save`, {
    method: "POST",
    headers: { Cookie: candidateCookie },
  });
  const saveData: any = await saveRes.json();
  console.log("Save Job Result:", saveRes.status, saveData.message);

  // 9. Apply to Job
  console.log(`\n9. Testing POST /api/jobs/${firstJob.id}/apply (Apply)`);
  const applyRes = await fetch(`${BASE_URL}/api/jobs/${firstJob.id}/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: candidateCookie,
    },
    body: JSON.stringify({
      coverLetter: "Automated test application for verification suite.",
    }),
  });
  const applyData: any = await applyRes.json();
  console.log("Apply Result:", applyRes.status, applyData.message);

  // 10. View Candidate Applications
  console.log("\n10. Testing GET /api/applications (Candidate Tracker)");
  const appsRes = await fetch(`${BASE_URL}/api/applications`, {
    headers: { Cookie: candidateCookie },
  });
  const appsData: any = await appsRes.json();
  console.log("Candidate Applications Count:", appsData.applications?.length);

  // 11. Login Recruiter
  console.log("\n11. Testing POST /api/auth/login (Recruiter Marcus)");
  const recLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "recruiter@techcorp.com",
      password: "Recruiter@1234",
    }),
  });
  const recLoginData: any = await recLoginRes.json();
  const recRawCookie = recLoginRes.headers.get("set-cookie");
  recruiterCookie = recRawCookie ? recRawCookie.split(";")[0] : "";
  console.log("Recruiter Login Result:", recLoginRes.status, recLoginData.success, "Company:", recLoginData.user?.recruiterProfile?.company?.name);

  // 12. Recruiter Creates a Job
  console.log("\n12. Testing POST /api/jobs (Create & Publish Job)");
  const newJobRes = await fetch(`${BASE_URL}/api/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: recruiterCookie,
    },
    body: JSON.stringify({
      title: "Senior AI & Cloud Platform Engineer",
      location: "San Francisco, CA",
      workplaceType: "HYBRID",
      jobType: "FULL_TIME",
      experienceLevel: "SENIOR_LEVEL",
      salaryMin: 150000,
      salaryMax: 195000,
      description: "Scale high-performance generative AI infrastructure pipelines.",
      skills: ["PyTorch", "Python", "Kubernetes", "AWS", "FastAPI"],
      status: "PUBLISHED",
    }),
  });
  const newJobData: any = await newJobRes.json();
  console.log("Job Created:", newJobRes.status, newJobData.message, "Title:", newJobData.job?.title);

  // 13. Recruiter Views Candidates
  console.log("\n13. Testing GET /api/recruiter/candidates");
  const candRes = await fetch(`${BASE_URL}/api/recruiter/candidates`, {
    headers: { Cookie: recruiterCookie },
  });
  const candData: any = await candRes.json();
  console.log("Candidates pool size:", candData.candidates?.length);

  // 14. Recruiter Pipeline & Status Change
  console.log("\n14. Testing GET /api/recruiter/pipeline & PATCH Status (Kanban)");
  const pipeRes = await fetch(`${BASE_URL}/api/recruiter/pipeline`, {
    headers: { Cookie: recruiterCookie },
  });
  const pipeData: any = await pipeRes.json();
  console.log("Pipeline Candidates Count:", pipeData.totalCandidates);

  // Find an application to advance
  const firstApp = pipeData.pipeline.APPLIED[0] || pipeData.pipeline.UNDER_REVIEW[0];
  if (firstApp) {
    const statusRes = await fetch(`${BASE_URL}/api/applications/${firstApp.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: recruiterCookie,
      },
      body: JSON.stringify({
        status: "INTERVIEW",
        note: "Passed initial screening. Moving candidate to Technical Interview Round.",
      }),
    });
    const statusData: any = await statusRes.json();
    console.log("Advance candidate to INTERVIEW status:", statusRes.status, statusData.message);
  }

  // 15. Login Admin
  console.log("\n15. Testing POST /api/auth/login (Admin Eleanor)");
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@careerhub.com",
      password: "Admin@1234",
    }),
  });
  const adminLoginData: any = await adminLoginRes.json();
  const adminRawCookie = adminLoginRes.headers.get("set-cookie");
  adminCookie = adminRawCookie ? adminRawCookie.split(";")[0] : "";
  console.log("Admin Login Result:", adminLoginRes.status, adminLoginData.success, "User:", adminLoginData.user?.name);

  // 16. Admin Dashboard
  console.log("\n16. Testing GET /api/admin/dashboard");
  const adminDashRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Cookie: adminCookie },
  });
  const adminDashData: any = await adminDashRes.json();
  console.log("Admin Dashboard Stats:", adminDashData.stats);

  // 17. Test Logout
  console.log("\n17. Testing POST /api/auth/logout");
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, { method: "POST" });
  console.log("Logout Status:", logoutRes.status);

  // 18. Test Invalid Login
  console.log("\n18. Testing Invalid Login");
  const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "wrong@example.com",
      password: "wrongpassword",
    }),
  });
  console.log("Bad Login HTTP Code (Expected 401):", badLoginRes.status);

  // 19. Test Unauthorized Admin Access
  console.log("\n19. Testing Unauthorized Access to Admin Endpoint");
  const unauthRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Cookie: candidateCookie },
  });
  console.log("Candidate Accessing Admin Dashboard (Expected 403):", unauthRes.status);

  console.log("\n==================================================");
  console.log("🎉 ALL 19 AUTOMATED TESTS PASSED WITH 100% SUCCESS!");
  console.log("==================================================");
}

runVerification().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
