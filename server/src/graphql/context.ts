import { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { Request } from "express";
import { getUserFromToken, extractToken } from "../middleware/auth";

export interface Context {
  prisma: PrismaClient;
  userId?: number;
}

export const createContext = ({ req }: { req: Request }): Context => {
  // Extract token from authorization header
  const authHeader = req.headers.authorization;
  const token = extractToken(authHeader);

  // Get user ID from token if present
  const userId = token ? getUserFromToken(token) : undefined;

  return {
    prisma,
    userId: userId ?? undefined,
  };
};
