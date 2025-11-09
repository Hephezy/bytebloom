import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Context } from "../context";
import {
  validateEmail,
  validatePassword,
  sanitizeString,
} from "../../lib/validation";

interface Register {
  email: string;
  password: string;
  name?: string;
}

interface Login {
  email: string;
  password: string;
}

interface UpdateUserArgs {
  id: number;
  name?: string;
  bio?: string;
}

// Ensure JWT_SECRET is set
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const userResolvers = {
  Query: {
    hello: () => "Hello from the GraphQL server!",

    getUserById: async (_: unknown, { id }: { id: number }, ctx: Context) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id },
        include: {
          posts: true,
          followers: true,
          following: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return {
        ...user,
        followers: user.followers?.length || 0,
        following: user.following?.length || 0,
        postsCount: user.posts?.length || 0,
      };
    },

    getUserStats: async (_: unknown, { id }: { id: number }, ctx: Context) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id },
        include: {
          posts: true,
          followers: true,
          following: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return {
        id: user.id,
        postsCount: user.posts?.length || 0,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
      };
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      { email, password, name }: Register,
      ctx: Context
    ) => {
      // Validate email
      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }

      // Validate password
      const passwordError = validatePassword(password);
      if (passwordError) {
        throw new Error(passwordError);
      }

      // Sanitize name if provided
      const sanitizedName = name ? sanitizeString(name, 100) : undefined;

      // Check if user already exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await ctx.prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          name: sanitizedName,
        },
      });

      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return { token, user };
    },

    login: async (_: unknown, { email, password }: Login, ctx: Context) => {
      // Validate email format
      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }

      // Find user
      const user = await ctx.prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error("Invalid email or password");
      }

      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return { token, user };
    },

    updateUser: async (
      _: unknown,
      { id, name, bio }: UpdateUserArgs,
      ctx: Context
    ) => {
      // PROTECTED: User can only update their own profile
      if (!ctx.userId) {
        throw new Error("You must be logged in to update your profile");
      }

      if (ctx.userId !== id) {
        throw new Error("You can only update your own profile");
      }

      // Check if user exists
      const user = await ctx.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Sanitize inputs
      const updateData: any = {};

      if (name !== undefined) {
        const sanitizedName = sanitizeString(name, 100);
        if (!sanitizedName) {
          throw new Error("Name cannot be empty");
        }
        updateData.name = sanitizedName;
      }

      if (bio !== undefined) {
        updateData.bio = sanitizeString(bio, 500);
      }

      // Update user
      return await ctx.prisma.user.update({
        where: { id },
        data: updateData,
      });
    },

    followUser: async (
      _: unknown,
      { userId }: { userId: number },
      ctx: Context
    ) => {
      if (!ctx.userId) {
        throw new Error("You must be logged in to follow users");
      }

      if (ctx.userId === userId) {
        throw new Error("You cannot follow yourself");
      }

      const userToFollow = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userToFollow) {
        throw new Error("User not found");
      }

      // Check if already following
      const currentUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        include: { following: true },
      });

      const alreadyFollowing = currentUser?.following.some(
        (u) => u.id === userId
      );

      if (alreadyFollowing) {
        throw new Error("You are already following this user");
      }

      await ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: {
          following: {
            connect: { id: userId },
          },
        },
      });

      return await ctx.prisma.user.findUnique({
        where: { id: userId },
        include: { followers: true, following: true },
      });
    },

    unfollowUser: async (
      _: unknown,
      { userId }: { userId: number },
      ctx: Context
    ) => {
      if (!ctx.userId) {
        throw new Error("You must be logged in to unfollow users");
      }

      // Check if currently following
      const currentUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        include: { following: true },
      });

      const isFollowing = currentUser?.following.some((u) => u.id === userId);

      if (!isFollowing) {
        throw new Error("You are not following this user");
      }

      await ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: {
          following: {
            disconnect: { id: userId },
          },
        },
      });

      return await ctx.prisma.user.findUnique({
        where: { id: userId },
        include: { followers: true, following: true },
      });
    },
  },
};
