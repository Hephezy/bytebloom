"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { GET_CATEGORIES_QUERY, GetCategoriesQueryData } from "@/lib/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

export default function CategoriesPage() {
  const { data, loading, error } = useQuery<GetCategoriesQueryData>(
    GET_CATEGORIES_QUERY
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">Error loading categories: {error.message}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Categories
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse posts by category
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {data && data.getCategories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No categories found
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.getCategories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <FolderOpen className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {category.description || "No description available"}
                    </p>
                    <p className="text-sm text-primary font-semibold">
                      {category.posts?.length || 0} posts
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}