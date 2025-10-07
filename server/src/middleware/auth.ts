import { Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
}

export interface JWTPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

export const getUserFromToken = (token: string): number | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "SUPER_SECRET"
    ) as JWTPayload;
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

export const extractToken = (authHeader?: string): string | null => {
  if (!authHeader) return null;

  // Support both "Bearer TOKEN" and just "TOKEN"
  const parts = authHeader.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    return parts[1];
  }
  return authHeader;
};

export const authenticateUser = (req: AuthRequest): number | null => {
  const authHeader = req.headers.authorization;
  const token = extractToken(authHeader);

  if (!token) return null;

  return getUserFromToken(token);
};
