import { Context } from "../context";

export const categoryResolvers = {
  Query: {
    getCategories: async (_: unknown, __: unknown, ctx: Context) => {
      return await ctx.prisma.category.findMany({
        include: {
          posts: {
            include: {
              post: true,
            },
          },
        },
        orderBy: { name: "asc" },
      });
    },

    getCategoryBySlug: async (
      _: unknown,
      { slug }: { slug: string },
      ctx: Context
    ) => {
      if (!slug || slug.trim() === "") {
        throw new Error("Invalid category slug provided");
      }

      const category = await ctx.prisma.category.findUnique({
        where: { slug },
        include: {
          posts: {
            include: {
              post: true,
            },
          },
        },
      });

      if (!category) {
        throw new Error(`Category with slug "${slug}" not found`);
      }

      return category;
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
      // PROTECTED: User must be logged in (you could add admin check here)
      if (!ctx.userId) {
        throw new Error("You must be logged in to create a category");
      }

      // Check if category with same name or slug already exists
      const existingCategory = await ctx.prisma.category.findFirst({
        where: {
          OR: [{ name: name }, { slug: slug }],
        },
      });

      if (existingCategory) {
        throw new Error("Category with this name or slug already exists");
      }

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
      if (!ctx.userId) {
        throw new Error("You must be logged in to update a category");
      }

      // If updating name or slug, check for duplicates
      if (name || slug) {
        const existingCategory = await ctx.prisma.category.findFirst({
          where: {
            AND: [
              { id: { not: id } },
              {
                OR: [
                  ...(name ? [{ name: name }] : []),
                  ...(slug ? [{ slug: slug }] : []),
                ],
              },
            ],
          },
        });

        if (existingCategory) {
          throw new Error("Category with this name or slug already exists");
        }
      }

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
      if (!ctx.userId) {
        throw new Error("You must be logged in to delete a category");
      }

      // Check if category has associated posts
      const postsCount = await ctx.prisma.postCategory.count({
        where: { categoryId: id },
      });

      if (postsCount > 0) {
        throw new Error(
          `Cannot delete category. It is associated with ${postsCount} post(s). Please remove or reassign these posts first.`
        );
      }

      return await ctx.prisma.category.delete({
        where: { id },
      });
    },
  },

  Category: {
    posts: async (parent: any, _: unknown, ctx: Context) => {
      try {
        const postCategories = await ctx.prisma.postCategory.findMany({
          where: { categoryId: parent.id },
          include: {
            post: {
              include: {
                author: true,
                images: true,
                comments: true,
              },
            },
          },
        });
        return postCategories.map((pc) => pc.post);
      } catch (error) {
        console.error(`Error loading posts for category ${parent.id}:`, error);
        return [];
      }
    },
  },
};
