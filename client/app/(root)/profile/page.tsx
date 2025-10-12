"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import {
  GET_POSTS_BY_USER_QUERY,
  DELETE_POST_MUTATION,
  UPDATE_USER_MUTATION,
  GetPostsByUserQueryData,
  GetPostsByUserQueryVariables,
  DeletePostMutationData,
  DeletePostMutationVariables,
  UpdateUserMutationData,
  UpdateUserMutationVariables,
} from "@/lib/graphql";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");

  // Move all hooks BEFORE any conditional returns
  const userId = session?.user?.id ? parseInt(session.user.id as string) : null;

  const { data, loading, error, refetch } = useQuery<
    GetPostsByUserQueryData,
    GetPostsByUserQueryVariables
  >(GET_POSTS_BY_USER_QUERY, {
    variables: { userId: userId || 0 },
    skip: !userId,
  });

  const [deletePost] = useMutation<
    DeletePostMutationData,
    DeletePostMutationVariables
  >(DELETE_POST_MUTATION, {
    onCompleted: () => {
      alert("Post deleted successfully!");
      refetch();
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const [updateUser, { loading: updateLoading }] = useMutation<
    UpdateUserMutationData,
    UpdateUserMutationVariables
  >(UPDATE_USER_MUTATION, {
    onCompleted: (data) => {
      alert("Profile updated successfully!");
      // Update the session with new name
      updateSession({
        user: {
          ...session?.user,
          name: data.updateUser.name,
        },
      });
      setEditMode(false);
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  // Now do conditional redirects AFTER all hooks
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost({ variables: { id } });
    }
  };

  const handleUpdateProfile = async () => {
    if (!userId) return;

    if (!name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    await updateUser({
      variables: {
        id: userId,
        name: name.trim(),
      },
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl flex flex-col mx-auto px-4 py-8 gap-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {session?.user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  {editMode ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-2xl font-bold bg-background border border-input rounded px-2 py-1 text-foreground"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-foreground">
                      {session?.user?.name || "User"}
                    </h1>
                  )}
                  <p className="text-muted-foreground">{session?.user?.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={updateLoading}
                      className="px-4 py-2 bg-primary text-primary-foreground cursor-pointer rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setName(session?.user?.name || "");
                      }}
                      className="px-4 py-2 bg-secondary text-secondary-foreground cursor-pointer rounded-md"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md flex items-center cursor-pointer gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Posts Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Posts</h2>
            <p className="text-muted-foreground">
              {data?.getPostsByUser.length || 0} posts
            </p>
          </div>
          <Link
            href="/blog/new"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>

        {/* Posts Grid */}
        {loading && (
          <div className="text-center py-12 text-muted-foreground">
            Loading posts...
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-destructive">
            Error loading posts: {error.message}
          </div>
        )}

        {data && data.getPostsByUser.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't created any posts yet
              </p>
              <Link
                href="/blog/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Create Your First Post
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.getPostsByUser.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              {post.coverImage && (
                <div className="relative h-48 w-full bg-muted">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  {post.categories?.map((category) => (
                    <span
                      key={category.id}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                    >
                      {category.name}
                    </span>
                  ))}
                  <span className="text-sm text-muted-foreground">
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {formatDate(post.createdAt)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {post.comments.length} comments
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link
                  href={`/blog/${post.id}`}
                  className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-center text-sm flex items-center justify-center gap-2 hover:bg-secondary/80"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
                <Link
                  href={`/blog/${post.id}/edit`}
                  className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-md text-center text-sm flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(parseInt(post.id))}
                  className="px-3 py-2 bg-destructive text-destructive-foreground rounded-md text-sm flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}