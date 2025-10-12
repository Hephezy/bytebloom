import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Context } from "../context";

interface Register {
  email: string;
  password: string;
  name: string;
}

interface Login {
  email: string;
  password: string;
}

interface UpdateUserArgs {
  id: number;
  name?: string;
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
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await ctx.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || "SUPER_SECRET"
      );

      return { token, user };
    },

    login: async (_: unknown, { email, password }: Login, ctx: Context) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || "SUPER_SECRET"
      );

      return { token, user };
    },

    updateUser: async (
      _: unknown,
      { id, name }: UpdateUserArgs,
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

      // Update user
      return await ctx.prisma.user.update({
        where: { id },
        data: {
          ...(name && { name }),
        },
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
