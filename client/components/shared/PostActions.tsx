"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useSession } from "next-auth/react";
import { Heart, Share2, Copy, Mail } from "lucide-react";
import {
  LIKE_POST_MUTATION,
  UNLIKE_POST_MUTATION,
  SHARE_POST_MUTATION,
  IS_POST_LIKED_QUERY,
  LikePostMutationData,
  LikePostMutationVariables,
  UnlikePostMutationData,
  UnlikePostMutationVariables,
  SharePostMutationData,
  SharePostMutationVariables,
  IsPostLikedQueryData,
  IsPostLikedQueryVariables,
} from "@/lib/graphql";

interface PostActionsProps {
  postId: number;
  postTitle: string;
  likes: number;
  shares: number;
}

export default function PostActions({
  postId,
  postTitle,
  likes,
  shares,
}: PostActionsProps) {
  const { data: session } = useSession();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Check if current user liked the post
  const { data: likeData, refetch: refetchLike } = useQuery<
    IsPostLikedQueryData,
    IsPostLikedQueryVariables
  >(IS_POST_LIKED_QUERY, {
    variables: { postId },
    skip: !session,
  });

  const isLiked = likeData?.isPostLiked || false;

  const [likePost] = useMutation<
    LikePostMutationData,
    LikePostMutationVariables
  >(LIKE_POST_MUTATION, {
    onCompleted: () => {
      refetchLike();
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const [unlikePost] = useMutation<
    UnlikePostMutationData,
    UnlikePostMutationVariables
  >(UNLIKE_POST_MUTATION, {
    onCompleted: () => {
      refetchLike();
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const [sharePost] = useMutation<
    SharePostMutationData,
    SharePostMutationVariables
  >(SHARE_POST_MUTATION, {
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const handleLike = async () => {
    if (!session) {
      alert("Please login to like posts");
      return;
    }

    if (isLiked) {
      await unlikePost({ variables: { postId } });
    } else {
      await likePost({ variables: { postId } });
    }
  };

  const handleShare = async (method: "copy" | "email" | "twitter") => {
    const url = `${window.location.origin}/blog/${postId}`;
    const text = `Check out this post: ${postTitle}`;

    if (method === "copy") {
      navigator.clipboard.writeText(url);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
      await sharePost({ variables: { postId } });
    } else if (method === "email") {
      window.location.href = `mailto:?subject=${encodeURIComponent(postTitle)}&body=${encodeURIComponent(text + " " + url)}`;
      await sharePost({ variables: { postId } });
    } else if (method === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
      await sharePost({ variables: { postId } });
    }
  };

  return (
    <div className="flex gap-4 pt-4">
      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${isLiked
          ? "bg-destructive/10 border-destructive text-destructive"
          : "border-input text-foreground hover:bg-accent"
          }`}
      >
        <Heart
          className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
        />
        <span className="text-sm font-medium">{likes}</span>
      </button>

      {/* Share Button */}
      <div className="relative">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input hover:bg-accent transition-colors text-foreground"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-medium">{shares}</span>
        </button>

        {/* Share Menu */}
        {showShareMenu && (
          <div className="absolute top-full mt-2 left-0 bg-background border border-input rounded-lg shadow-lg overflow-hidden z-10">
            <button
              onClick={() => {
                handleShare("copy");
                setShowShareMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-foreground hover:bg-accent flex items-center gap-2 text-sm"
            >
              <Copy className="w-4 h-4" />
              {copiedToClipboard ? "Copied!" : "Copy Link"}
            </button>
            <button
              onClick={() => {
                handleShare("email");
                setShowShareMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-foreground hover:bg-accent flex items-center gap-2 text-sm border-t border-input"
            >
              <Mail className="w-4 h-4" />
              Share via Email
            </button>
            <button
              onClick={() => {
                handleShare("twitter");
                setShowShareMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-foreground hover:bg-accent flex items-center gap-2 text-sm border-t border-input"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-7.066 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              Share on Twitter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}