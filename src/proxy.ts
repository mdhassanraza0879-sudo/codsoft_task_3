import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const AUTH_COOKIE_NAME = "careerhub_token";

interface TokenPayload {
  userId: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER" | "ADMIN";
  name: string;
  exp?: number;
}

function parseJwt(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    // Check expiry
    if (parsed.exp && parsed.exp * 1000 < Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? parseJwt(token) : null;

  // 1. If visiting /login or /register while already authenticated, redirect to appropriate portal
  if (payload && (pathname === "/login" || pathname === "/register")) {
    if (payload.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (payload.role === "RECRUITER") {
      return NextResponse.redirect(new URL("/recruiter/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Protect Admin Routes
  if (pathname.startsWith("/admin")) {
    if (!payload) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 3. Protect Recruiter Routes
  if (pathname.startsWith("/recruiter")) {
    if (!payload) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (payload.role !== "RECRUITER" && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 4. Protect Candidate Dashboard & Application Tracking Routes
  const candidateRoutes = ["/dashboard", "/applications", "/saved-jobs", "/profile"];
  if (candidateRoutes.some((route) => pathname.startsWith(route))) {
    if (!payload) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (payload.role === "RECRUITER") {
      return NextResponse.redirect(new URL("/recruiter/dashboard", request.url));
    }
    if (payload.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/admin/:path*",
    "/recruiter/:path*",
    "/dashboard/:path*",
    "/applications/:path*",
    "/saved-jobs/:path*",
    "/profile/:path*",
  ],
};
