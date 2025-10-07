import { userResolvers } from "./user.resolvers";
import { postResolvers } from "./post.resolvers";
import { categoryResolvers } from "./category.resolver";

export const resolvers = [userResolvers, postResolvers, categoryResolvers];
