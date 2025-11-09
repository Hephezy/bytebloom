import { deleteFromCloudinary } from "../../lib/cloudinary";
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
  categoryIds: number[]; // Changed to array
  images?: ImageInput[];
}

interface UpdatePostArgs {
  id: number;
  title?: string;
  content?: string;
  published?: boolean;
  coverImage?: string;
  categoryIds?: number[]; // Changed to array
  images?: ImageInput[];
}

interface GetPostsArgs {
  categoryId?: number;
  published?: boolean;
}

/**
 * Extracts the publicId from a Cloudinary URL.
 * Assumes a URL structure like: .../upload/v.../folder/public_id.ext
 */
const getPublicIdFromUrl = (url: string): string | null => {
  if (!url) return null;
  try {
    // Regex to find the part after /upload/ (and optional version) up to the extension
    const match = url.match(/\/upload\/(?:v\d+\/)?(.*?)\.[^.]+$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error parsing publicId from URL:", error);
    return null;
  }
};

export const postResolvers = {
  Query: {
    getPosts: async (_: unknown, args: GetPostsArgs, ctx: Context) => {
      return await ctx.prisma.post.findMany({
        where: {
          ...(args.categoryId && {
            categories: {
              some: {
                categoryId: args.categoryId,
              },
            },
          }),
          ...(args.published !== undefined && { published: args.published }),
        },
        include: {
          author: true,
          categories: {
            include: {
              category: true,
            },
          },
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
          categories: {
            include: {
              category: true,
            },
          },
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

    getRecentPosts: async (
      _: unknown,
      { limit }: { limit?: number },
      ctx: Context
    ) => {
      return await ctx.prisma.post.findMany({
        where: { published: true },
        include: {
          author: true,
          categories: {
            include: {
              category: true,
            },
          },
          images: {
            orderBy: { order: "asc" },
          },
          comments: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit || 10,
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
          categories: {
            include: {
              category: true,
            },
          },
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
        where: {
          categories: {
            some: {
              categoryId: categoryId,
            },
          },
        },
        include: {
          author: true,
          categories: {
            include: {
              category: true,
            },
          },
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
        categoryIds,
        images,
      }: CreatePostArgs,
      ctx: Context
    ) => {
      // PROTECTED: User must be logged in
      if (!ctx.userId) {
        throw new Error("You must be logged in to create a post");
      }

      console.log(`[POST] Creating post "${title}" for user ${ctx.userId}`);

      // Validate that all categories exist
      const categories = await ctx.prisma.category.findMany({
        where: {
          id: {
            in: categoryIds,
          },
        },
      });

      if (categories.length !== categoryIds.length) {
        throw new Error("One or more category IDs are invalid");
      }

      return await ctx.prisma.post.create({
        data: {
          title,
          content,
          published,
          coverImage,
          authorId: ctx.userId,
          categories: {
            create: categoryIds.map((categoryId) => ({
              category: {
                connect: { id: categoryId },
              },
            })),
          },
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
          categories: {
            include: {
              category: true,
            },
          },
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
        categoryIds,
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
        include: { images: true },
      });

      if (!existingPost) {
        throw new Error("Post not found");
      }

      if (existingPost.authorId !== ctx.userId) {
        throw new Error("You can only update your own posts");
      }

      if (
        coverImage !== undefined && // A new image URL is being provided (or set to null)
        existingPost.coverImage && // An old image exists
        existingPost.coverImage !== coverImage // The old and new URLs are different
      ) {
        const publicId = getPublicIdFromUrl(existingPost.coverImage);
        if (publicId) {
          try {
            await deleteFromCloudinary(publicId);
            console.log(`[POST UPDATE] Deleted old cover image: ${publicId}`);
          } catch (err) {
            console.error(`Failed to delete old cover image ${publicId}:`, err);
          }
        }
      }

      // If categoryIds provided, validate them
      if (categoryIds) {
        const categories = await ctx.prisma.category.findMany({
          where: {
            id: {
              in: categoryIds,
            },
          },
        });

        if (categories.length !== categoryIds.length) {
          throw new Error("One or more category IDs are invalid");
        }

        // Delete existing category associations
        await ctx.prisma.postCategory.deleteMany({
          where: { postId: id },
        });
      }

      // If images are provided, delete old ones and create new ones
      if (images) {
        for (const oldImage of existingPost.images) {
          const publicId = getPublicIdFromUrl(oldImage.url);
          if (publicId) {
            try {
              await deleteFromCloudinary(publicId);
              console.log(`[POST UPDATE] Deleted old post image: ${publicId}`);
            } catch (err) {
              console.error(
                `Failed to delete old post image ${publicId}:`,
                err
              );
            }
          }
        }

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
          ...(categoryIds && {
            categories: {
              create: categoryIds.map((categoryId) => ({
                category: {
                  connect: { id: categoryId },
                },
              })),
            },
          }),
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
          categories: {
            include: {
              category: true,
            },
          },
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
        include: { images: true },
      });

      if (!existingPost) {
        throw new Error("Post not found");
      }

      if (existingPost.authorId !== ctx.userId) {
        throw new Error("You can only delete your own posts");
      }

      // Delete cover image from Cloudinary
      if (existingPost.coverImage) {
        const publicId = getPublicIdFromUrl(existingPost.coverImage);
        if (publicId) {
          try {
            await deleteFromCloudinary(publicId);
            console.log(`[POST DELETE] Deleted cover image: ${publicId}`);
          } catch (err) {
            console.error(`Failed to delete cover image ${publicId}:`, err);
          }
        }
      }

      // Delete post images from Cloudinary
      for (const image of existingPost.images) {
        const publicId = getPublicIdFromUrl(image.url);
        if (publicId) {
          try {
            await deleteFromCloudinary(publicId);
            console.log(`[POST DELETE] Deleted post image: ${publicId}`);
          } catch (err) {
            console.error(`Failed to delete post image ${publicId}:`, err);
          }
        }
      }

      return await ctx.prisma.post.delete({
        where: { id },
        include: {
          author: true,
          categories: {
            include: {
              category: true,
            },
          },
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
    categories: async (parent: any, _: unknown, ctx: Context) => {
      const postCategories = await ctx.prisma.postCategory.findMany({
        where: { postId: parent.id },
        include: {
          category: true,
        },
      });
      return postCategories.map((pc) => pc.category);
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
