import { Context } from "../context";

export const categoryResolvers = {
  Query: {
    getCategories: async (_: unknown, __: unknown, ctx: Context) => {
      return await ctx.prisma.category.findMany({
        include: { posts: true },
        orderBy: { name: "asc" },
      });
    },

    getCategoryBySlug: async (
      _: unknown,
      { slug }: { slug: string },
      ctx: Context
    ) => {
      return await ctx.prisma.category.findUnique({
        where: { slug },
        include: { posts: true },
      });
    },
  },

  Mutation: {
    createCategory: async (
      _: unknown,
      {
        name,
        slug,
        description,
      }: { name: string; slug: string; description?: string },
      ctx: Context
    ) => {
      return await ctx.prisma.category.create({
        data: { name, slug, description },
      });
    },

    updateCategory: async (
      _: unknown,
      {
        id,
        name,
        slug,
        description,
      }: { id: number; name?: string; slug?: string; description?: string },
      ctx: Context
    ) => {
      return await ctx.prisma.category.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(slug && { slug }),
          ...(description !== undefined && { description }),
        },
      });
    },

    deleteCategory: async (
      _: unknown,
      { id }: { id: number },
      ctx: Context
    ) => {
      return await ctx.prisma.category.delete({
        where: { id },
      });
    },
  },

  Category: {
    posts: async (parent: any, _: unknown, ctx: Context) => {
      return await ctx.prisma.post.findMany({
        where: { categoryId: parent.id },
      });
    },
  },
};
