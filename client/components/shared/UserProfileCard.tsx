"use client";

import { useState } from "react";
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

  const { data: userData, loading } = useQuery<
    GetUserByIdQueryData,
    GetUserByIdQueryVariables
  >(GET_USER_BY_ID_QUERY, {
    variables: { id: userId },
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
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!userData?.getUserById) {
    return null;
  }

  const user = userData.getUserById;
  const isOwnProfile = currentUserId === userId;

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
              {user.postsCount}
            </p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {user.followers}
            </p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {user.following}
            </p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>

        {/* Actions */}
        {!isOwnProfile && (
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
            className="w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors bg-primary text-primary-foreground hover:opacity-90"
          >
            Edit Profile
          </Link>
        )}
      </CardContent>
    </Card>
  );
}