// client/app/categories/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  GET_CATEGORY_BY_SLUG_QUERY,
  GetCategoryBySlugQueryData,
  GetCategoryBySlugQueryVariables,
} from "@/lib/graphql";
import BlogCard from "@/components/card/BlogCard";

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, loading, error } = useQuery<
    GetCategoryBySlugQueryData,
    GetCategoryBySlugQueryVariables
  >(GET_CATEGORY_BY_SLUG_QUERY, {
    variables: { slug },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !data?.getCategoryBySlug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">
            Category Not Found
          </h1>
          <Link href="/categories" className="text-primary hover:underline">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  const category = data.getCategoryBySlug;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>

        {/* Category Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-muted-foreground">{category.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {category?.posts?.length} posts
          </p>
        </div>

        {/* Posts Grid */}
        {category?.posts?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No posts in this category yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category?.posts?.map((post) => (
              <BlogCard key={post.id} post={post} direction="column" />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}