"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, User as UserIcon, MessageCircle } from "lucide-react";
import {
  GET_POST_BY_ID_QUERY,
  CREATE_COMMENT_MUTATION,
  GetPostByIdQueryData,
  GetPostByIdQueryVariables,
  CreateCommentMutationData,
  CreateCommentMutationVariables,
} from "@/lib/graphql";
import { formatDate, getReadingTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SinglePostPage() {
  const params = useParams();
  const { data: session } = useSession();
  const postId = parseInt(params.id as string);
  const [commentContent, setCommentContent] = useState("");

  const { data, loading, error, refetch } = useQuery<
    GetPostByIdQueryData,
    GetPostByIdQueryVariables
  >(GET_POST_BY_ID_QUERY, {
    variables: { id: postId },
  });

  const [createComment, { loading: commentLoading }] = useMutation<
    CreateCommentMutationData,
    CreateCommentMutationVariables
  >(CREATE_COMMENT_MUTATION, {
    onCompleted: () => {
      setCommentContent("");
      refetch();
      alert("Comment added successfully!");
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert("Please login to comment");
      return;
    }

    if (!commentContent.trim()) {
      alert("Please enter a comment");
      return;
    }

    await createComment({
      variables: {
        postId,
        content: commentContent,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading post...</div>
      </div>
    );
  }

  if (error || !data?.getPostById) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Post Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The post you're looking for doesn't exist
          </p>
          <Link href="/blog" className="text-primary hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const post = data.getPostById;
  const readingTime = getReadingTime(post.content);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Post Header */}
        <article>
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-primary/10 text-primary rounded-full">
              {post.categories[0]?.name || 'Uncategorized'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              <span className="font-medium text-foreground">{post.author.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <span>•</span>
            <span>{readingTime}</span>
            <span>•</span>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments.length} comments</span>
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          {post.content && (
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <div
                className="text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          )}

          {/* Content Images */}
          {post.images.length > 0 && (
            <div className="mb-8 space-y-6">
              {post.images.map((image) => (
                <figure key={image.id} className="space-y-2">
                  <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.alt || ''}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {image.caption && (
                    <figcaption className="text-sm text-muted-foreground text-center italic">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </article>

        {/* Divider */}
        <div className="border-t border-border my-12"></div>

        {/* Comments Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Comments ({post.comments.length})
          </h2>

          {/* Add Comment Form */}
          {session ? (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Write a comment..."
                    rows={4}
                    className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-y"
                  />
                  <button
                    type="submit"
                    disabled={commentLoading}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {commentLoading ? "Posting..." : "Post Comment"}
                  </button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Please login to leave a comment
                </p>
                <Link
                  href="/login"
                  className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90"
                >
                  Login
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No comments yet. Be the first to comment!
                </CardContent>
              </Card>
            ) : (
              post.comments.map((comment) => (
                <Card key={comment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {comment.author.name?.charAt(0) || 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {comment.author.name || 'Anonymous'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}