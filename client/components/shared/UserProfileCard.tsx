"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Users } from "lucide-react";
import {
  GET_USER_BY_ID_QUERY,
  FOLLOW_USER_MUTATION,
  UNFOLLOW_USER_MUTATION,
  GetUserByIdQueryData,
  GetUserByIdQueryVariables,
} from "@/lib/graphql";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface UserProfileCardProps {
  userId: number;
}

export default function UserProfileCard({ userId }: UserProfileCardProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id ? parseInt(session.user.id as string) : null;
  const [isFollowing, setIsFollowing] = useState(false);

  // Fix: Convert both IDs to numbers for proper comparison
  const isOwnProfile = currentUserId !== null && currentUserId === userId;

  console.log("UserProfileCard Debug:", {
    currentUserId,
    userId,
    isOwnProfile,
    sessionUserId: session?.user?.id,
  });

  const { data: userData, loading, error } = useQuery<
    GetUserByIdQueryData,
    GetUserByIdQueryVariables
  >(GET_USER_BY_ID_QUERY, {
    variables: { id: userId },
    skip: !userId,
  });

  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    onCompleted: () => {
      setIsFollowing(true);
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    onCompleted: () => {
      setIsFollowing(false);
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const handleFollow = async () => {
    if (!session) {
      alert("Please login to follow users");
      return;
    }

    if (isFollowing) {
      await unfollowUser({ variables: { userId } });
    } else {
      await followUser({ variables: { userId } });
    }
  };

  if (loading) {
    return (
      <Card className="sticky top-4">
        <CardContent className="py-8">
          <div className="animate-pulse text-center text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !userData?.getUserById) {
    return (
      <Card className="sticky top-4">
        <CardContent className="py-8">
          <div className="text-center text-destructive">
            Failed to load profile
          </div>
        </CardContent>
      </Card>
    );
  }

  const user = userData.getUserById;

  return (
    <Card className="sticky top-4">
      <CardHeader className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold text-primary">
            {user.name?.charAt(0) || "U"}
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground">{user.name || "User"}</h3>
        {user.bio && (
          <p className="text-sm text-muted-foreground mt-2">{user.bio}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">
              {user.postsCount || 0}
            </p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {user.followers || 0}
            </p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {user.following || 0}
            </p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>

        {/* Actions */}
        {!isOwnProfile && session && (
          <button
            onClick={handleFollow}
            className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${isFollowing
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
          >
            <Users className="w-4 h-4" />
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}

        {isOwnProfile && (
          <Link
            href="/profile"
            className="block w-full py-2 rounded-lg font-medium text-center transition-colors bg-primary text-primary-foreground hover:opacity-90"
          >
            Edit Profile
          </Link>
        )}

        {!session && !isOwnProfile && (
          <Link
            href="/login"
            className="block w-full py-2 rounded-lg font-medium text-center transition-colors bg-primary text-primary-foreground hover:opacity-90"
          >
            Login to Follow
          </Link>
        )}
      </CardContent>
    </Card>
  );
}