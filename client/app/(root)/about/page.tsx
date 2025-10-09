import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Database, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            About The Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            A modern blogging platform built with cutting-edge technologies
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              The Blog is a modern blogging platform designed to make content creation
              and sharing seamless and enjoyable. We believe in the power of stories
              and the importance of providing a platform where voices can be heard.
            </p>
            <p>
              Our platform is built with the latest web technologies to ensure a fast,
              reliable, and user-friendly experience for both writers and readers.
            </p>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            Built With Modern Tech
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Next.js 15</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  React framework with App Router, Server Components, and
                  optimized performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>GraphQL</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Flexible API with Apollo Server and Client for efficient data
                  fetching
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Prisma</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Type-safe database ORM with PostgreSQL for robust data
                  management
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Create, edit, and delete your blog posts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Organize content with categories</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Engage with readers through comments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Beautiful dark mode support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Responsive design for all devices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Secure authentication with NextAuth</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}