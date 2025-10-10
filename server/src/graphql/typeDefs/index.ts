import { readFileSync } from "fs";
import { join } from "path";

// Load the user.graphql file
const userTypeDefs = readFileSync(join(__dirname, "./user.graphql"), {
  encoding: "utf-8",
});

const postTypeDefs = readFileSync(join(__dirname, "./post.graphql"), {
  encoding: "utf-8",
});

const categoryTypeDefs = readFileSync(join(__dirname, "./category.graphql"), {
  encoding: "utf-8",
});

const imageTypeDefs = readFileSync(join(__dirname, "./image.graphql"), {
  encoding: "utf-8",
});

const commentTypeDefs = readFileSync(join(__dirname, "./comment.graphql"), {
  encoding: "utf-8",
});

const scalarsTypeDefs = readFileSync(join(__dirname, "./scalars.graphql"), {
  encoding: "utf-8",
});

// Export an array of all your type definitions
export const typeDefs = [
  scalarsTypeDefs,
  userTypeDefs,
  postTypeDefs,
  categoryTypeDefs,
  imageTypeDefs,
  commentTypeDefs,
];
