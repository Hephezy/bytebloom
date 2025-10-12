"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { SUBSCRIBE_TO_NEWSLETTER_MUTATION, SubscribeToNewsletterMutationData, SubscribeToNewsletterMutationVariables } from "@/lib/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [subscribe, { loading }] = useMutation<
    SubscribeToNewsletterMutationData,
    SubscribeToNewsletterMutationVariables
  >(SUBSCRIBE_TO_NEWSLETTER_MUTATION, {
    onCompleted: () => {
      setEmail("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(""), 5000);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    await subscribe({
      variables: { email: email.trim() },
    });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-background py-20 px-4 mb-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Mail className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Stay Updated
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Subscribe to our newsletter and get the latest posts, insights, and stories
            delivered directly to your inbox. Join our growing community of readers and
            never miss an update.
          </p>
        </div>
      </section>

      {/* Subscription Form */}
      <section className="max-w-2xl mx-auto px-4 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Subscribe to Our Newsletter</CardTitle>
          </CardHeader>
          <CardContent>
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    Successfully subscribed!
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Check your email for a confirmation. Thank you for joining!
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-100">
                    Error
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Benefits Section */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">
          What You'll Get
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📰 Latest Posts</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Get notified when new posts are published. Never miss an article from your
              favorite authors.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Curated Content</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Receive a carefully selected collection of the best posts from our community.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✨ Exclusive Insights</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Access exclusive behind-the-scenes content and special updates for subscribers.
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}