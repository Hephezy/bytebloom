"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useSession } from "next-auth/react";
import { Heart, Trash2, Pencil, X } from "lucide-react";
import {
  LIKE_COMMENT_MUTATION,
  UNLIKE_COMMENT_MUTATION,
  DELETE_COMMENT_MUTATION,
  UPDATE_COMMENT_MUTATION,
} from "@/lib/graphql";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CommentItemProps {
  comment: any;
  onCommentUpdated?: () => void;
}

export default function CommentItem({
  comment,
  onCommentUpdated,
}: CommentItemProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id ? parseInt(session.user.id as string) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isLiked, setIsLiked] = useState(
    comment.likedBy?.includes(userId) || false
  );
  const [likeCount, setLikeCount] = useState(comment.likes || 0);

  console.log("CommentItem userId:", userId, "commentAuthorId:", comment.authorId);

  const [likeComment] = useMutation(LIKE_COMMENT_MUTATION, {
    onCompleted: () => {
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const [unlikeComment] = useMutation(UNLIKE_COMMENT_MUTATION, {
    onCompleted: () => {
      setIsLiked(false);
      setLikeCount(Math.max(0, likeCount - 1));
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    onCompleted: () => {
      alert("Comment deleted successfully!");
      onCommentUpdated?.();
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const [updateComment] = useMutation(UPDATE_COMMENT_MUTATION, {
    onCompleted: (data) => {
      console.log("Comment updated:", data);
      alert("Comment updated successfully!");
      setIsEditing(false);
      onCommentUpdated?.();
    },
    onError: (err) => {
      console.error("Update error:", err);
      alert(`Error: ${err.message}`);
    },
  });

  const handleLike = async () => {
    if (!session) {
      alert("Please login to like comments");
      return;
    }

    if (isLiked) {
      await unlikeComment({ variables: { commentId: parseInt(comment.id) } });
    } else {
      await likeComment({ variables: { commentId: parseInt(comment.id) } });
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      await deleteComment({ variables: { id: parseInt(comment.id) } });
    }
  };

  const handleUpdateComment = async () => {
    if (!editedContent.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    console.log("Updating comment with:", {
      id: parseInt(comment.id),
      content: editedContent.trim(),
    });

    await updateComment({
      variables: {
        id: parseInt(comment.id),
        content: editedContent.trim(),
      },
    });
  };

  // Debug: Check if user is comment author
  const isCommentAuthor = userId === parseInt(comment.authorId);
  console.log("Is comment author?", isCommentAuthor, userId, comment.authorId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {comment.author.name?.charAt(0) || "A"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {comment.author.name || "Anonymous"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </p>
            </div>
          </div>
          {isCommentAuthor && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
                title="Edit"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdateComment}
                className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:opacity-90"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(comment.content);
                }}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-foreground whitespace-pre-wrap mb-4">
              {comment.content}
            </p>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked
                ? "text-destructive"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>
          </>
        )}
      </CardContent>
    </Card>
  );
}