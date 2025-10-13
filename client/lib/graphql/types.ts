// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  name?: string;
  bio?: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface UpdateUserMutationData {
  updateUser: User;
}

export interface UpdateUserMutationVariables {
  id: number;
  name?: string;
  bio?: string;
}

// ============================================
// UPLOAD TYPES
// ============================================

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export interface UploadImageMutationData {
  uploadImage: UploadResult;
}

export interface UploadImageMutationVariables {
  file: string;
}

export interface DeleteImageMutationData {
  deleteImage: boolean;
}

export interface DeleteImageMutationVariables {
  publicId: string;
}

// ============================================
// POST TYPES
// ============================================

export interface Post {
  id: string;
  title: string;
  content?: string;
  coverImage?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: User;
  authorId: number;
  categories: Category[];
  images: Image[];
  comments: Comment[];
  likes: number;
  shares: number;
}

export interface CreatePostInput {
  title: string;
  content?: string;
  published?: boolean;
  coverImage?: string;
  categoryIds: number[];
  images?: ImageInput[];
}

export interface UpdatePostInput {
  id: number;
  title?: string;
  content?: string;
  published?: boolean;
  coverImage?: string;
  categoryIds?: number[];
  images?: ImageInput[];
}

// ============================================
// IMAGE TYPES
// ============================================

export interface Image {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  postId: number;
  order: number;
  createdAt: string;
}

export interface ImageInput {
  url: string;
  alt?: string;
  caption?: string;
  order?: number;
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  posts?: Post[];
  createdAt: string;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryInput {
  id: number;
  name?: string;
  slug?: string;
  description?: string;
}

// ============================================
// COMMENT TYPES
// ============================================

export interface Comment {
  id: string;
  content: string;
  postId: number;
  post: Post;
  authorId: number;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  postId: number;
  content: string;
}

export interface UpdateCommentInput {
  id: number;
  content: string;
}

// ============================================
// QUERY RESPONSE TYPES
// ============================================

export interface GetPostsQueryData {
  getPosts: Post[];
}

export interface GetPostsQueryVariables {
  categoryId?: number;
  published?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetRecentPostsQueryData {
  getRecentPosts: Post[];
}

export interface GetRecentPostsQueryVariables {
  limit?: number;
}

export interface GetPostByIdQueryData {
  getPostById: Post;
}

export interface GetPostByIdQueryVariables {
  id: number;
}

export interface GetPostsByUserQueryData {
  getPostsByUser: Post[];
}

export interface GetPostsByUserQueryVariables {
  userId: number;
}

export interface GetPostsByCategoryQueryData {
  getPostsByCategory: Post[];
}

export interface GetPostsByCategoryQueryVariables {
  categoryId: number;
}

export interface GetCategoriesQueryData {
  getCategories: Category[];
}

export interface GetCategoryBySlugQueryData {
  getCategoryBySlug: Category;
}

export interface GetCategoryBySlugQueryVariables {
  slug: string;
}

export interface GetCommentsByPostQueryData {
  getCommentsByPost: Comment[];
}

export interface GetCommentsByPostQueryVariables {
  postId: number;
}

export interface GetCommentQueryData {
  getComment: Comment;
}

export interface GetCommentQueryVariables {
  id: number;
}

export interface GetHomepageDataQueryData {
  getPosts: Post[];
  getCategories: Category[];
}

export interface HelloQueryData {
  hello: string;
}

// ============================================
// MUTATION RESPONSE TYPES
// ============================================

export interface RegisterMutationData {
  register: AuthPayload;
}

export interface RegisterMutationVariables {
  email: string;
  password: string;
  name?: string;
}

export interface LoginMutationData {
  login: AuthPayload;
}

export interface LoginMutationVariables {
  email: string;
  password: string;
}

export interface CreatePostMutationData {
  createPost: Post;
}

export interface CreatePostMutationVariables {
  title: string;
  content?: string;
  published?: boolean;
  coverImage?: string;
  categoryIds: number[];
  images?: ImageInput[];
}

export interface UpdatePostMutationData {
  updatePost: Post;
}

export interface UpdatePostMutationVariables {
  id: number;
  title?: string;
  content?: string;
  published?: boolean;
  coverImage?: string;
  categoryIds?: number[];
  images?: ImageInput[];
}

export interface DeletePostMutationData {
  deletePost: Post;
}

export interface DeletePostMutationVariables {
  id: number;
}

export interface CreateCommentMutationData {
  createComment: Comment;
}

export interface CreateCommentMutationVariables {
  postId: number;
  content: string;
}

export interface UpdateCommentMutationData {
  updateComment: Comment;
}

export interface UpdateCommentMutationVariables {
  id: number;
  content: string;
}

export interface DeleteCommentMutationData {
  deleteComment: Comment;
}

export interface DeleteCommentMutationVariables {
  id: number;
}

export interface CreateCategoryMutationData {
  createCategory: Category;
}

export interface CreateCategoryMutationVariables {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryMutationData {
  updateCategory: Category;
}

export interface UpdateCategoryMutationVariables {
  id: number;
  name?: string;
  slug?: string;
  description?: string;
}

export interface DeleteCategoryMutationData {
  deleteCategory: Category;
}

export interface DeleteCategoryMutationVariables {
  id: number;
}

// ========================================
// NEWSLETTER TYPES
// ========================================
export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface SubscribeToNewsletterMutationData {
  subscribeToNewsletter: NewsletterSubscriber;
}

export interface SubscribeToNewsletterMutationVariables {
  email: string;
}

export interface LikePostMutationData {
  likePost: Post;
}

export interface LikePostMutationVariables {
  postId: number;
}

export interface UnlikePostMutationData {
  unlikePost: Post;
}

export interface UnlikePostMutationVariables {
  postId: number;
}

export interface SharePostMutationData {
  sharePost: Post;
}

export interface SharePostMutationVariables {
  postId: number;
}

export interface LikeCommentMutationData {
  likeComment: Comment;
}

export interface LikeCommentMutationVariables {
  commentId: number;
}

export interface UnlikeCommentMutationData {
  unlikeComment: Comment;
}

export interface UnlikeCommentMutationVariables {
  commentId: number;
}

export interface FollowUserMutationData {
  followUser: User;
}

export interface FollowUserMutationVariables {
  userId: number;
}

export interface UnfollowUserMutationData {
  unfollowUser: User;
}

export interface UnfollowUserMutationVariables {
  userId: number;
}

export interface GetUserByIdQueryData {
  getUserById: User & {
    followers: number;
    following: number;
    postsCount: number;
  };
}

export interface GetUserByIdQueryVariables {
  id: number;
}

export interface GetUserStatsQueryData {
  getUserStats: {
    id: number;
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
}

export interface GetUserStatsQueryVariables {
  id: number;
}

export interface IsPostLikedQueryData {
  isPostLiked: boolean;
}

export interface IsPostLikedQueryVariables {
  postId: number;
}
