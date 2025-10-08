import RecentBlogPosts from "@/components/shared/RecentBlogPosts";

export default function BlogPage() {

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <RecentBlogPosts direction="row" />
    </main>
  );
}