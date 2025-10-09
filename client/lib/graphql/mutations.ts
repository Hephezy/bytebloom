import { gql } from "@apollo/client";

// ============================================
// AUTH MUTATIONS
// ============================================

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $name: String) {
    register(email: $email, password: $password, name: $name) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

// ============================================
// POST MUTATIONS
// ============================================

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost(
    $title: String!
    $content: String
    $published: Boolean
    $coverImage: String
    $categoryIds: [Int!]!
    $images: [ImageInput!]
  ) {
    createPost(
      title: $title
      content: $content
      published: $published
      coverImage: $coverImage
      categoryIds: $categoryIds
      images: $images
    ) {
      id
      title
      content
      coverImage
      published
      createdAt
      author {
        id
        name
        email
      }
      categories {
        id
        name
        slug
      }
      images {
        id
        url
        alt
        caption
        order
      }
    }
  }
`;

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost(
    $id: Int!
    $title: String
    $content: String
    $published: Boolean
    $coverImage: String
    $categoryIds: [Int!]
    $images: [ImageInput!]
  ) {
    updatePost(
      id: $id
      title: $title
      content: $content
      published: $published
      coverImage: $coverImage
      categoryIds: $categoryIds
      images: $images
    ) {
      id
      title
      content
      coverImage
      published
      updatedAt
      author {
        id
        name
      }
      categories {
        id
        name
        slug
      }
      images {
        id
        url
        alt
        caption
        order
      }
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id) {
      id
      title
    }
  }
`;

// ============================================
// COMMENT MUTATIONS
// ============================================

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($postId: Int!, $content: String!) {
    createComment(postId: $postId, content: $content) {
      id
      content
      createdAt
      author {
        id
        name
      }
      post {
        id
        title
      }
    }
  }
`;

export const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateComment($id: Int!, $content: String!) {
    updateComment(id: $id, content: $content) {
      id
      content
      updatedAt
      author {
        id
        name
      }
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($id: Int!) {
    deleteComment(id: $id) {
      id
      content
    }
  }
`;

// ============================================
// CATEGORY MUTATIONS
// ============================================

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory(
    $name: String!
    $slug: String!
    $description: String
  ) {
    createCategory(name: $name, slug: $slug, description: $description) {
      id
      name
      slug
      description
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory(
    $id: Int!
    $name: String
    $slug: String
    $description: String
  ) {
    updateCategory(
      id: $id
      name: $name
      slug: $slug
      description: $description
    ) {
      id
      name
      slug
      description
    }
  }
`;

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: Int!) {
    deleteCategory(id: $id) {
      id
      name
    }
  }
`;
