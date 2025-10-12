import { Context } from "../context";
import { uploadToCloudinary, deleteFromCloudinary } from "../../lib/cloudinary";

interface UploadImageArgs {
  file: string; // Base64 encoded image
}

interface DeleteImageArgs {
  publicId: string;
}

export const uploadResolvers = {
  Mutation: {
    uploadImage: async (
      _: unknown,
      { file }: UploadImageArgs,
      ctx: Context
    ) => {
      // Check if user is authenticated
      if (!ctx.userId) {
        throw new Error("You must be logged in to upload images");
      }

      try {
        const result = await uploadToCloudinary(file);
        return result;
      } catch (error) {
        console.error("Upload error:", error);
        throw new Error("Failed to upload image");
      }
    },

    deleteImage: async (
      _: unknown,
      { publicId }: DeleteImageArgs,
      ctx: Context
    ) => {
      // Check if user is authenticated
      if (!ctx.userId) {
        throw new Error("You must be logged in to delete images");
      }

      try {
        await deleteFromCloudinary(publicId);
        return true;
      } catch (error) {
        console.error("Delete error:", error);
        return false;
      }
    },
  },
};
