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

export const userResolvers = {
  Mutation: {
    register: async (
      _: unknown,
      { email, password, name }: Register,
      ctx: Context
    ) => {
      const hashedPassword = await bcrypt.hash(password, 10);

      // Use Prisma to create a new user in the database
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
      // Use Prisma to find the user by email
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
  },
  Query: {
    hello: () => "Hello from the GraphQL server!",
  },
};
