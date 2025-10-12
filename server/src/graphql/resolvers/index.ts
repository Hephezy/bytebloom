import { GraphQLScalarType, Kind } from "graphql";
import { userResolvers } from "./user.resolvers";
import { postResolvers } from "./post.resolvers";
import { categoryResolvers } from "./category.resolver";
import { commentResolvers } from "./comment.resolvers";
import { uploadResolvers } from "./upload.resolvers";
import { newsletterResolvers } from "./newsletter.resolver";
import { postInteractionResolvers } from "./post-interaction.resolver";

// DateTime scalar resolver
const dateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "DateTime custom scalar type",

  serialize(value: unknown): number {
    if (value instanceof Date) {
      return value.getTime(); // Convert Date to milliseconds timestamp
    }
    throw new Error("DateTime must be a Date object");
  },

  parseValue(value: unknown): Date {
    if (typeof value === "number") {
      return new Date(value);
    }
    if (typeof value === "string") {
      return new Date(value);
    }
    throw new Error("DateTime must be a number (timestamp) or string (ISO)");
  },

  parseLiteral(ast): Date {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error("DateTime must be a number or string");
  },
});

const scalarResolvers = {
  DateTime: dateTimeScalar,
};

export const resolvers = [
  scalarResolvers,
  userResolvers,
  postResolvers,
  categoryResolvers,
  commentResolvers,
  uploadResolvers,
  newsletterResolvers,
  postInteractionResolvers,
];
