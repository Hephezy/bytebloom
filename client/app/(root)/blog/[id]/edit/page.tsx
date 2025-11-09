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
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/shared/ImageUpload";

type CategoryOption = { id: string; name: string };

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
  const [selectedCategories, setSelectedCategories] = useState<CategoryOption[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      setSelectedCategories(
        post.categories.map((cat) => ({ id: cat.id, name: cat.name }))
      );
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

  // Filter suggestions
  const filteredSuggestions = categoriesData?.getCategories.filter((cat) => {
    const isAlreadySelected = selectedCategories.some((selected) => selected.id === cat.id);
    const matchesInput = cat.name.toLowerCase().includes(categoryInput.toLowerCase());
    return !isAlreadySelected && matchesInput && categoryInput.trim() !== "";
  }) || [];

  const handleAddCategory = (category: CategoryOption) => {
    if (!selectedCategories.some((cat) => cat.id === category.id)) {
      setSelectedCategories([...selectedCategories, category]);
      setCategoryInput("");
      setShowSuggestions(false);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat.id !== categoryId));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        handleAddCategory(filteredSuggestions[0]);
      }
    } else if (e.key === "Backspace" && categoryInput === "" && selectedCategories.length > 0) {
      handleRemoveCategory(selectedCategories[selectedCategories.length - 1].id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (selectedCategories.length === 0) {
      alert("Please select at least one category");
      return;
    }

    const categoryIds = selectedCategories
      .map((cat) => Number(cat.id))
      .filter((id) => !isNaN(id));

    if (categoryIds.length === 0 || categoryIds.length !== selectedCategories.length) {
      alert("Invalid category IDs. Please try again.");
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

  // --- Check if the logged-in user is the author ---
  const isAuthor = postData?.getPostById?.authorId === parseInt(session?.user?.id as string);
  if (!isAuthor && status === "authenticated" && !postLoading) {
    router.push("/blog");
    alert("You are not authorized to edit this post.");
    return null;
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
              {/* <div>
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
              </div> */}

              <ImageUpload
                label="Cover Image"
                onUploadComplete={(url) => setCoverImage(url)}
                currentImage={coverImage}
              />

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Categories *
                </label>
                <div className="relative">
                  <div className="w-full min-h-[42px] px-2 py-1 bg-background border border-input rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-ring flex flex-wrap gap-2 items-center">
                    {selectedCategories.map((category) => (
                      <span
                        key={category.id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {category.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(category.id)}
                          className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      id="category"
                      type="text"
                      value={categoryInput}
                      onChange={(e) => {
                        setCategoryInput(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="flex-1 min-w-[120px] outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
                      placeholder={selectedCategories.length === 0 ? "Type to search categories..." : ""}
                      disabled={!categoriesData?.getCategories || categoriesData.getCategories.length === 0}
                    />
                  </div>
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredSuggestions.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleAddCategory(category)}
                          className="w-full px-4 py-2 text-left hover:bg-accent text-foreground transition-colors"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Press Enter to add categories.
                </p>
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