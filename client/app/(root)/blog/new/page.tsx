"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CREATE_POST_MUTATION,
  GET_CATEGORIES_QUERY,
  CreatePostMutationData,
  CreatePostMutationVariables,
  GetCategoriesQueryData,
} from "@/lib/graphql";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import QuillEditor from "@/components/shared/QuillEditor";
import ImageUpload from "@/components/shared/ImageUpload";

export default function CreatePostPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [published, setPublished] = useState(false);

  // Redirect if not logged in
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // Fetch categories
  const { data: categoriesData } = useQuery<GetCategoriesQueryData>(GET_CATEGORIES_QUERY);

  const [createPost, { loading, error }] = useMutation<
    CreatePostMutationData,
    CreatePostMutationVariables
  >(CREATE_POST_MUTATION, {
    onCompleted: (data) => {
      alert("Post created successfully!");
      router.push(`/blog/${data.createPost.id}`);
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

  const handleAddCategory = (category: { id: string; name: string }) => {
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

      if (!categoriesData?.getCategories || categoriesData.getCategories.length === 0) {
        alert("No categories are available. Please contact an administrator to create categories.");
        return;
      }

      if (filteredSuggestions.length > 0) {
        handleAddCategory(filteredSuggestions[0]);
      } else if (categoryInput.trim()) {
        const similarCategories = categoriesData?.getCategories
          .filter(cat =>
            cat.name.toLowerCase().includes(categoryInput.toLowerCase())
          )
          .map(c => c.name)
          .join(", ");

        if (similarCategories) {
          alert(`"${categoryInput}" not found. Did you mean: ${similarCategories}?`);
        } else {
          alert(`Category "${categoryInput}" not found.\n\nAvailable categories:\n${categoriesData?.getCategories.map(c => `• ${c.name}`).join('\n') || 'None'
            }\n\nIf you need a new category, please contact an administrator.`);
        }
        setCategoryInput("");
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
      .map((cat) => {
        const id = Number(cat.id);
        if (isNaN(id)) {
          console.error(`Invalid category ID: ${cat.id}`);
        }
        return id;
      })
      .filter((id) => !isNaN(id));

    if (categoryIds.length === 0) {
      alert("Invalid category IDs. Please ensure selected categories have valid numeric IDs.");
      return;
    }

    if (categoryIds.length !== selectedCategories.length) {
      alert("One or more categories have invalid IDs. Please try again.");
      return;
    }

    await createPost({
      variables: {
        title,
        content,
        coverImage: coverImage || undefined,
        categoryIds,
        published,
      },
    });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Create New Post</h1>
          <p className="text-muted-foreground">Share your thoughts with the world</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
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

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Categories *
                </label>

                {/* Show loading state */}
                {!categoriesData && (
                  <div className="text-sm text-muted-foreground mb-2">
                    Loading categories...
                  </div>
                )}

                {/* Show error if categories failed to load */}
                {categoriesData?.getCategories && categoriesData.getCategories.length === 0 && (
                  <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm mb-4">
                    <p className="font-semibold mb-1">No categories available</p>
                    <p>
                      Please contact an administrator to create categories before creating posts.
                      The system requires at least one category to organize content.
                    </p>
                  </div>
                )}

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
                  Press Enter to add categories. Select multiple categories for your post.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Content
                </label>
                <QuillEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your post content here..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="published"
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded border-input"
                />
                <label htmlFor="published" className="text-sm text-foreground">
                  Publish immediately (uncheck to save as draft)
                </label>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
                  {error.message}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : published ? "Publish Post" : "Save as Draft"}
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