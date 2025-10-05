import { readFileSync } from "fs";
import { join } from "path";

// Load the user.graphql file
const userTypeDefs = readFileSync(join(__dirname, "./user.graphql"), {
  encoding: "utf-8",
});

// Export an array of all your type definitions
export const typeDefs = [userTypeDefs];
