import { Context } from "../context";

interface SubscribeArgs {
  email: string;
}

export const newsletterResolvers = {
  Mutation: {
    subscribeToNewsletter: async (
      _: unknown,
      { email }: SubscribeArgs,
      ctx: Context
    ) => {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email address");
      }

      // Check if already subscribed
      const existingSubscriber =
        await ctx.prisma.newsletterSubscriber.findUnique({
          where: { email },
        });

      if (existingSubscriber) {
        throw new Error("This email is already subscribed to our newsletter");
      }

      // Create new subscriber
      return await ctx.prisma.newsletterSubscriber.create({
        data: { email },
      });
    },
  },
};
