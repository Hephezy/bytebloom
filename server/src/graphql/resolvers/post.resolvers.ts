import { Context } from "../context";

interface ImageInput {
  url: string;
  alt?: string;
  caption?: string;
  order?: number;
}

interface CreatePostArgs {
  title: string;
  content?: string;
  published?: boolean;
  coverImage?: string;
  categoryId: number;
  images?: ImageInput[];
}

interface UpdatePostArgs {
  id: number;
  title?: string;
  content?: string;
  published?: boolean;
  coverImage?: string;
  categoryId?: number;
  images?: ImageInput[];
}

interface GetPostsArgs {
  categoryId?: number;
  published?: boolean;
}

export const postResolvers = {
  Query: {
    getPosts: async (_: unknown, args: GetPostsArgs, ctx: Context) => {
      return await ctx.prisma.post.findMany({
        where: {
          ...(args.categoryId && { categoryId: args.categoryId }),
          ...(args.published !== undefined && { published: args.published }),
        },
        include: {
          author: true,
          category: true,
          images: {
            orderBy: { order: "asc" },
          },
          comments: true,
        },
        orderBy: { createdAt: "desc" },
      });
    },

    getPostById: async (_: unknown, { id }: { id: number }, ctx: Context) => {
      return await ctx.prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
          category: true,
          images: {
            orderBy: { order: "asc" },
          },
          comments: {
            include: { author: true },
            orderBy: { createdAt: "desc" },
          },
        },
      });
    },

    getPostsByUser: async (
      _: unknown,
      { userId }: { userId: number },
      ctx: Context
    ) => {
      return await ctx.prisma.post.findMany({
        where: { authorId: userId },
        include: {
          author: true,
          category: true,
          images: {
            orderBy: { order: "asc" },
          },
          comments: true,
        },
      });
    },

    getPostsByCategory: async (
      _: unknown,
      { categoryId }: { categoryId: number },
      ctx: Context
    ) => {
      return await ctx.prisma.post.findMany({
        where: { categoryId },
        include: {
          author: true,
          category: true,
          images: {
            orderBy: { order: "asc" },
          },
          comments: true,
        },
        orderBy: { createdAt: "desc" },
      });
    },
  },

  Mutation: {
    createPost: async (
      _: unknown,
      {
        title,
        content,
        published = false,
        coverImage,
        categoryId,
        images,
      }: CreatePostArgs,
      ctx: Context
    ) => {
      // PROTECTED: User must be logged in
      if (!ctx.userId) {
        throw new Error("You must be logged in to create a post");
      }

      return await ctx.prisma.post.create({
        data: {
          title,
          content,
          published,
          coverImage,
          categoryId,
          authorId: ctx.userId,
          ...(images && {
            images: {
              create: images.map((img, index) => ({
                url: img.url,
                alt: img.alt,
                caption: img.caption,
                order: img.order ?? index,
              })),
            },
          }),
        },
        include: {
          author: true,
          category: true,
          images: {
            orderBy: { order: "asc" },
          },
          comments: true,
        },
      });
    },

    updatePost: async (
      _: unknown,
      {
        id,
        title,
        content,
        published,
        coverImage,
        categoryId,
        images,
      }: UpdatePostArgs,
      ctx: Context
    ) => {
      // PROTECTED: User must be logged in
      if (!ctx.userId) {
        throw new Error("You must be logged in to update a post");
      }

      // Check if post exists and belongs to user
      const existingPost = await ctx.prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        throw new Error("Post not found");
      }

      if (existingPost.authorId !== ctx.userId) {
        throw new Error("You can only update your own posts");
      }

      // If images are provided, delete old ones and create new ones
      if (images) {
        await ctx.prisma.image.deleteMany({
          where: { postId: id },
        });
      }

      return await ctx.prisma.post.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(content !== undefined && { content }),
          ...(published !== undefined && { published }),
          ...(coverImage !== undefined && { coverImage }),
          ...(categoryId && { categoryId }),
          ...(images && {
            images: {
              create: images.map((img, index) => ({
                url: img.url,
                alt: img.alt,
                caption: img.caption,
                order: img.order ?? index,
              })),
            },
          }),
        },
        include: {
          author: true,
          category: true,
          images: {
            orderBy: { order: "asc" },
          },
          comments: true,
        },
      });
    },

    deletePost: async (_: unknown, { id }: { id: number }, ctx: Context) => {
      // PROTECTED: User must be logged in
      if (!ctx.userId) {
        throw new Error("You must be logged in to delete a post");
      }

      // Check if post exists and belongs to user
      const existingPost = await ctx.prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        throw new Error("Post not found");
      }

      if (existingPost.authorId !== ctx.userId) {
        throw new Error("You can only delete your own posts");
      }

      return await ctx.prisma.post.delete({
        where: { id },
        include: {
          author: true,
          category: true,
          images: true,
          comments: true,
        },
      });
    },
  },

  Post: {
    author: async (parent: any, _: unknown, ctx: Context) => {
      return await ctx.prisma.user.findUnique({
        where: { id: parent.authorId },
      });
    },
    category: async (parent: any, _: unknown, ctx: Context) => {
      return await ctx.prisma.category.findUnique({
        where: { id: parent.categoryId },
      });
    },
    images: async (parent: any, _: unknown, ctx: Context) => {
      return await ctx.prisma.image.findMany({
        where: { postId: parent.id },
        orderBy: { order: "asc" },
      });
    },
    comments: async (parent: any, _: unknown, ctx: Context) => {
      return await ctx.prisma.comment.findMany({
        where: { postId: parent.id },
        include: { author: true },
        orderBy: { createdAt: "desc" },
      });
    },
  },
};
