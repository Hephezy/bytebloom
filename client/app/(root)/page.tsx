
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";
import RecentBlogPosts from "@/components/shared/RecentBlogPosts";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-primary/5 to-background py-20 px-4 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to The Blog
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A modern platform for sharing your thoughts, stories, and insights with the world.
            Create, publish, and connect with readers who care about your perspective.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Explore Posts
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/categories"
              className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
            >
              Browse Categories
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
            >
              Join Now
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 py-20 mb-20">
        <h2 className="text-4xl font-bold text-foreground text-center mb-12">
          Why Choose Our Platform?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground text-center mb-2">
                Rich Editor
              </h3>
              <p className="text-muted-foreground text-center">
                Write with a powerful editor that supports formatting, links, and media embedding.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground text-center mb-2">
                Community
              </h3>
              <p className="text-muted-foreground text-center">
                Connect with readers through comments and build meaningful discussions around your content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground text-center mb-2">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground text-center">
                Built with cutting-edge technology for optimal performance and user experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Featured Posts</h2>
          <p className="text-lg text-muted-foreground">
            Check out our most recent and popular articles
          </p>
        </div>
        <RecentBlogPosts direction="row" limit={4} />
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            View All Posts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join our community of writers and start publishing your content today
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}