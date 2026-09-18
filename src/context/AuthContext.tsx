"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER" | "ADMIN";
  avatar?: string | null;
  candidateProfile?: any;
  recruiterProfile?: any;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: AuthUser }>;
  register: (data: { name: string; email: string; password: string; role: string; companyName?: string }) => Promise<{ success: boolean; message: string; user?: AuthUser }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  switchDemoRole: (role: "ADMIN" | "RECRUITER" | "CANDIDATE") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        return { success: true, message: data.message, user: data.user };
      }
      return { success: false, message: data.message || "Invalid credentials" };
    } catch (err) {
      return { success: false, message: "Network error occurred during login" };
    }
  };

  const register = async (formData: { name: string; email: string; password: string; role: string; companyName?: string }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        return { success: true, message: data.message, user: data.user };
      }
      return { success: false, message: data.message || "Registration failed" };
    } catch (err) {
      return { success: false, message: "Network error occurred during registration" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  };

  const switchDemoRole = async (role: "ADMIN" | "RECRUITER" | "CANDIDATE") => {
    let creds = { email: "john.dev@example.com", password: "Candidate@1234" };
    let redirectUrl = "/dashboard";

    if (role === "ADMIN") {
      creds = { email: "admin@careerhub.com", password: "Admin@1234" };
      redirectUrl = "/admin";
    } else if (role === "RECRUITER") {
      creds = { email: "recruiter@techcorp.com", password: "Recruiter@1234" };
      redirectUrl = "/recruiter/dashboard";
    }

    const res = await login(creds.email, creds.password);
    if (res.success) {
      router.push(redirectUrl);
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
