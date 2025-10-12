import { Context } from "../context";

interface CreateCommentArgs {
  postId: number;
  content: string;
}

interface UpdateCommentArgs {
  id: number;
  content: string;
}

interface LikeCommentArgs {
  commentId: number;
}

export const commentResolvers = {
  Query: {
    getCommentsByPost: async (
      _: unknown,
      { postId }: { postId: number },
      ctx: Context
    ) => {
      return await ctx.prisma.comment.findMany({
        where: { postId },
        include: { author: true, post: true },
        orderBy: { createdAt: "desc" },
      });
    },

    getComment: async (_: unknown, { id }: { id: number }, ctx: Context) => {
      return await ctx.prisma.comment.findUnique({
        where: { id },
        include: { author: true, post: true },
      });
    },
  },

  Mutation: {
    createComment: async (
      _: unknown,
      { postId, content }: CreateCommentArgs,
      ctx: Context
    ) => {
      // Check if user is authenticated
      if (!ctx.userId) {
        throw new Error("You must be logged in to create a comment");
      }

      // Verify the post exists
      const post = await ctx.prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      return await ctx.prisma.comment.create({
        data: {
          content,
          postId,
          authorId: ctx.userId,
        },
        include: { author: true, post: true },
      });
    },

    updateComment: async (
      _: unknown,
      { id, content }: UpdateCommentArgs,
      ctx: Context
    ) => {
      if (!ctx.userId) {
        throw new Error("You must be logged in to update a comment");
      }

      // Check if comment exists and belongs to user
      const comment = await ctx.prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new Error("Comment not found");
      }

      if (comment.authorId !== ctx.userId) {
        throw new Error("You can only update your own comments");
      }

      return await ctx.prisma.comment.update({
        where: { id },
        data: { content },
        include: { author: true, post: true },
      });
    },

    deleteComment: async (_: unknown, { id }: { id: number }, ctx: Context) => {
      if (!ctx.userId) {
        throw new Error("You must be logged in to delete a comment");
      }

      // Check if comment exists and belongs to user
      const comment = await ctx.prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new Error("Comment not found");
      }

      if (comment.authorId !== ctx.userId) {
        throw new Error("You can only delete your own comments");
      }

      return await ctx.prisma.comment.delete({
        where: { id },
        include: { author: true, post: true },
      });
    },

    likeComment: async (
      _: unknown,
      { commentId }: LikeCommentArgs,
      ctx: Context
    ) => {
      if (!ctx.userId) {
        throw new Error("You must be logged in to like a comment");
      }

      const comment = await ctx.prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        throw new Error("Comment not found");
      }

      const alreadyLiked = comment.likedBy.includes(ctx.userId);
      if (alreadyLiked) {
        throw new Error("You already liked this comment");
      }

      return await ctx.prisma.comment.update({
        where: { id: commentId },
        data: {
          likes: comment.likes + 1,
          likedBy: [...comment.likedBy, ctx.userId],
        },
        include: { author: true, post: true },
      });
    },

    unlikeComment: async (
      _: unknown,
      { commentId }: LikeCommentArgs,
      ctx: Context
    ) => {
      if (!ctx.userId) {
        throw new Error("You must be logged in to unlike a comment");
      }

      const comment = await ctx.prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        throw new Error("Comment not found");
      }

      const hasLiked = comment.likedBy.includes(ctx.userId);
      if (!hasLiked) {
        throw new Error("You haven't liked this comment");
      }

      return await ctx.prisma.comment.update({
        where: { id: commentId },
        data: {
          likes: comment.likes - 1,
          likedBy: comment.likedBy.filter((id) => id !== ctx.userId),
        },
        include: { author: true, post: true },
      });
    },
  },

  Comment: {
    post: async (parent: any, _: unknown, ctx: Context) => {
      return await ctx.prisma.post.findUnique({
        where: { id: parent.postId },
      });
    },
    author: async (parent: any, _: unknown, ctx: Context) => {
      return await ctx.prisma.user.findUnique({
        where: { id: parent.authorId },
      });
    },
  },
};
