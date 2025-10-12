import { gql } from "@apollo/client";

// ============================================
// POST QUERIES
// ============================================

export const GET_POSTS_QUERY = gql`
  query GetPosts(
    $categoryId: Int
    $published: Boolean
    $limit: Int
    $offset: Int
  ) {
    getPosts(
      categoryId: $categoryId
      published: $published
      limit: $limit
      offset: $offset
    ) {
      id
      title
      content
      coverImage
      published
      createdAt
      updatedAt
      author {
        id
        name
        email
      }
      category {
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
      comments {
        id
      }
    }
  }
`;

export const GET_RECENT_POSTS_QUERY = gql`
  query GetRecentPosts($limit: Int) {
    getRecentPosts(limit: $limit) {
      id
      title
      content
      coverImage
      published
      createdAt
      updatedAt
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
      comments {
        id
      }
    }
  }
`;

export const GET_POST_BY_ID_QUERY = gql`
  query GetPostById($id: Int!) {
    getPostById(id: $id) {
      id
      title
      content
      coverImage
      published
      createdAt
      updatedAt
      author {
        id
        name
        email
      }
      categories {
        id
        name
        slug
        description
      }
      images {
        id
        url
        alt
        caption
        order
      }
      comments {
        id
        content
        createdAt
        updatedAt
        author {
          id
          name
        }
      }
    }
  }
`;

export const GET_POSTS_BY_USER_QUERY = gql`
  query GetPostsByUser($userId: Int!) {
    getPostsByUser(userId: $userId) {
      id
      title
      content
      coverImage
      published
      createdAt
      author {
        id
        name
      }
      categories {
        id
        name
        slug
      }
      comments {
        id
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY_QUERY = gql`
  query GetPostsByCategory($categoryId: Int!) {
    getPostsByCategory(categoryId: $categoryId) {
      id
      title
      content
      coverImage
      published
      createdAt
      author {
        id
        name
      }
      category {
        id
        name
        slug
      }
      images {
        id
        url
        alt
      }
      comments {
        id
      }
    }
  }
`;

// ============================================
// CATEGORY QUERIES
// ============================================

export const GET_CATEGORIES_QUERY = gql`
  query GetCategories {
    getCategories {
      id
      name
      slug
      description
      posts {
        id
        title
      }
    }
  }
`;

export const GET_CATEGORY_BY_SLUG_QUERY = gql`
  query GetCategoryBySlug($slug: String!) {
    getCategoryBySlug(slug: $slug) {
      id
      name
      slug
      description
      posts {
        id
        title
        coverImage
        createdAt
        author {
          name
        }
      }
    }
  }
`;

// ============================================
// COMMENT QUERIES
// ============================================

export const GET_COMMENTS_BY_POST_QUERY = gql`
  query GetCommentsByPost($postId: Int!) {
    getCommentsByPost(postId: $postId) {
      id
      content
      createdAt
      updatedAt
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

export const GET_COMMENT_QUERY = gql`
  query GetComment($id: Int!) {
    getComment(id: $id) {
      id
      content
      createdAt
      updatedAt
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

// ============================================
// COMBINED QUERIES (for optimization)
// ============================================

export const GET_HOMEPAGE_DATA_QUERY = gql`
  query GetHomepageData {
    getPosts(published: true) {
      id
      title
      content
      coverImage
      createdAt
      author {
        id
        name
      }
      category {
        id
        name
        slug
      }
      comments {
        id
      }
    }
    getCategories {
      id
      name
      slug
      posts {
        id
      }
    }
  }
`;

export const GET_USER_BY_ID_QUERY = gql`
  query GetUserById($id: Int!) {
    getUserById(id: $id) {
      id
      email
      name
      bio
      avatar
      followers
      following
      postsCount
    }
  }
`;

export const GET_USER_STATS_QUERY = gql`
  query GetUserStats($id: Int!) {
    getUserStats(id: $id) {
      id
      postsCount
      followersCount
      followingCount
    }
  }
`;

export const IS_POST_LIKED_QUERY = gql`
  query IsPostLiked($postId: Int!) {
    isPostLiked(postId: $postId)
  }
`;

// ============================================
// HELLO QUERY (for testing connection)
// ============================================

export const HELLO_QUERY = gql`
  query Hello {
    hello
  }
`;
