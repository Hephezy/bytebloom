"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import {
  GET_RECENT_POSTS_QUERY,
  GET_CATEGORIES_QUERY,
  GetRecentPostsQueryData,
  GetRecentPostsQueryVariables,
  GetCategoriesQueryData,
} from "@/lib/graphql";
import BlogCard from "@/components/card/BlogCard";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Fetch posts
  const { data: postsData, loading: postsLoading } = useQuery<
    GetRecentPostsQueryData,
    GetRecentPostsQueryVariables
  >(GET_RECENT_POSTS_QUERY, {
    variables: { limit: 100 },
  });

  // Fetch categories
  const { data: categoriesData } = useQuery<GetCategoriesQueryData>(
    GET_CATEGORIES_QUERY
  );

  // Filter and search posts
  const filteredPosts = postsData?.getRecentPosts
    ?.filter((post) => {
      // Search filter
      const matchesSearch = searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === null ||
        post.categories.some((cat) => parseInt(cat.id) === selectedCategory);

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    }) || [];

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery || selectedCategory || sortBy !== "newest";

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 px-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground">
            Discover articles, stories, and insights from our community
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              value={selectedCategory || ""}
              onChange={(e) =>
                setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)
              }
              className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            >
              <option value="">All Categories</option>
              {categoriesData?.getCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
              className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors whitespace-nowrap"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="text-sm text-muted-foreground mb-6">
          Found {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
          {hasActiveFilters && " matching your filters"}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {postsLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading posts...</div>
          </div>
        )}

        {!postsLoading && filteredPosts.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground mb-4">
                No posts found matching your filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Clear Filters
              </button>
            </CardContent>
          </Card>
        )}

        {!postsLoading && filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} direction="column" />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}