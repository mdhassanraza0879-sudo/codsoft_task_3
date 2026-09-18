import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "careerhub_fallback_dev_secret_key_2026";
export const AUTH_COOKIE_NAME = "careerhub_token";

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        candidateProfile: true,
        recruiterProfile: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!user || !user.isActive) return null;
    return user;
  } catch (error) {
    console.error("Error retrieving current user:", error);
    return null;
  }
}
