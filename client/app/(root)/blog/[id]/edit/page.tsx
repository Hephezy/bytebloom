"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  UPDATE_POST_MUTATION,
  GET_POST_BY_ID_QUERY,
  GET_CATEGORIES_QUERY,
  UpdatePostMutationData,
  UpdatePostMutationVariables,
  GetPostByIdQueryData,
  GetPostByIdQueryVariables,
  GetCategoriesQueryData,
} from "@/lib/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const postId = parseInt(params.id as string);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [published, setPublished] = useState(false);

  // Redirect if not logged in
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // Fetch post data
  const { data: postData, loading: postLoading } = useQuery<
    GetPostByIdQueryData,
    GetPostByIdQueryVariables
  >(GET_POST_BY_ID_QUERY, {
    variables: { id: postId },
  });

  useEffect(() => {
    if (postData?.getPostById) {
      const post = postData.getPostById;
      setTitle(post.title);
      setContent(post.content || "");
      setCoverImage(post.coverImage || "");
      setCategoryId(parseInt(post.categories[0]?.id || '1'));
      setPublished(post.published);
    }
  }, [postData]);

  // Fetch categories
  const { data: categoriesData } = useQuery<GetCategoriesQueryData>(
    GET_CATEGORIES_QUERY
  );

  const [updatePost, { loading, error }] = useMutation<
    UpdatePostMutationData,
    UpdatePostMutationVariables
  >(UPDATE_POST_MUTATION, {
    onCompleted: (data) => {
      alert("Post updated successfully!");
      router.push(`/blog/${data.updatePost.id}`);
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    await updatePost({
      variables: {
        id: postId,
        title,
        content,
        coverImage: coverImage || undefined,
        categoryIds: [categoryId],
        published,
      },
    });
  };

  if (status === "loading" || postLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!postData?.getPostById) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">Post not found</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
          <p className="text-muted-foreground">Update your post</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Enter post title"
                  required
                />
              </div>

              {/* Cover Image URL */}
              <div>
                <label
                  htmlFor="coverImage"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Cover Image URL
                </label>
                <input
                  id="coverImage"
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="https://example.com/image.jpg"
                />
                {coverImage && (
                  <div className="mt-2">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  required
                >
                  {categoriesData?.getCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-y"
                  placeholder="Write your post content here..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {content.length} characters
                </p>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-3">
                <input
                  id="published"
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded border-input"
                />
                <label htmlFor="published" className="text-sm text-foreground">
                  Published
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
                  {error.message}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update Post"}
                </button>
                <Link
                  href="/profile"
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}