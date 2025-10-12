import { Context } from "../context";

export const postInteractionResolvers = {
  Query: {
    getPostLikes: async (
      _: unknown,
      { postId }: { postId: number },
      ctx: Context
    ) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: postId },
      });

      return post?.likes || 0;
    },

    isPostLiked: async (
      _: unknown,
      { postId }: { postId: number },
      ctx: Context
    ) => {
      if (!ctx.userId) {
        return false;
      }

      const interaction = await ctx.prisma.postInteraction.findUnique({
        where: {
          userId_postId: {
            userId: ctx.userId,
            postId,
          },
        },
      });

      return !!interaction?.liked;
    },
  },

  Mutation: {
    likePost: async (
      _: unknown,
      { postId }: { postId: number },
      ctx: Context
    ) => {
      if (!ctx.userId) {
        throw new Error("You must be logged in to like posts");
      }

      const post = await ctx.prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      const existingInteraction = await ctx.prisma.postInteraction.findUnique({
        where: {
          userId_postId: {
            userId: ctx.userId,
            postId,
          },
        },
      });

      if (existingInteraction?.liked) {
        throw new Error("You already liked this post");
      }

      if (existingInteraction) {
        await ctx.prisma.postInteraction.update({
          where: { id: existingInteraction.id },
          data: { liked: true },
        });
      } else {
        await ctx.prisma.postInteraction.create({
          data: {
            userId: ctx.userId,
            postId,
            liked: true,
          },
        });
      }

      return await ctx.prisma.post.update({
        where: { id: postId },
        data: { likes: post.likes + 1 },
        include: {
          author: true,
          categories: { include: { category: true } },
          images: { orderBy: { order: "asc" } },
          comments: { include: { author: true } },
        },
      });
    },

    unlikePost: async (
      _: unknown,
      { postId }: { postId: number },
      ctx: Context
    ) => {
      if (!ctx.userId) {
        throw new Error("You must be logged in to unlike posts");
      }

      const post = await ctx.prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      const interaction = await ctx.prisma.postInteraction.findUnique({
        where: {
          userId_postId: {
            userId: ctx.userId,
            postId,
          },
        },
      });

      if (!interaction?.liked) {
        throw new Error("You haven't liked this post");
      }

      await ctx.prisma.postInteraction.update({
        where: { id: interaction.id },
        data: { liked: false },
      });

      return await ctx.prisma.post.update({
        where: { id: postId },
        data: { likes: Math.max(0, post.likes - 1) },
        include: {
          author: true,
          categories: { include: { category: true } },
          images: { orderBy: { order: "asc" } },
          comments: { include: { author: true } },
        },
      });
    },

    sharePost: async (
      _: unknown,
      { postId }: { postId: number },
      ctx: Context
    ) => {
      if (!ctx.userId) {
        throw new Error("You must be logged in to share posts");
      }

      const post = await ctx.prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      return await ctx.prisma.post.update({
        where: { id: postId },
        data: { shares: (post.shares || 0) + 1 },
        include: {
          author: true,
          categories: { include: { category: true } },
          images: { orderBy: { order: "asc" } },
          comments: { include: { author: true } },
        },
      });
    },
  },
};
