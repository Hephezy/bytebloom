import { userResolvers } from "./user.resolvers";
import { postResolvers } from "./post.resolvers";
import { categoryResolvers } from "./category.resolver";
import { commentResolvers } from "./comment.resolvers";

export const resolvers = [
  userResolvers,
  postResolvers,
  categoryResolvers,
  commentResolvers,
];
