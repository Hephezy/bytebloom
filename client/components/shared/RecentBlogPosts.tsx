"use client";

import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_RECENT_POSTS_QUERY, GetRecentPostsQueryData, GetRecentPostsQueryVariables } from '@/lib/graphql';
import BlogCard from '../card/BlogCard';

type LayoutDirection = 'row' | 'column';

interface RecentBlogPostsProps {
  direction: LayoutDirection;
  limit?: number;
}

const RecentBlogPosts = ({ direction, limit }: RecentBlogPostsProps) => {
  // Determine how many posts to fetch based on layout
  const postsToFetch = limit || (direction === 'row' ? 4 : 10);

  const { data, loading, error } = useQuery<GetRecentPostsQueryData, GetRecentPostsQueryVariables>(
    GET_RECENT_POSTS_QUERY,
    {
      variables: { limit: postsToFetch },
    }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-destructive">Error loading posts: {error.message}</div>
      </div>
    );
  }

  if (!data?.getRecentPosts || data.getRecentPosts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">No posts found</div>
      </div>
    );
  }

  const posts = data.getRecentPosts;

  // Column layout (simple list)
  if (direction === "column") {
    return (
      <div className='flex flex-col gap-6'>
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
            direction="column"
          />
        ))}
      </div>
    );
  }

  // Row layout (complex responsive grid)
  return (
    <div>
      {/* Desktop Layout (md and up) */}
      <div className='hidden md:block'>
        <div className='flex flex-col gap-6'>
          {/* First row: 1 large + 2 small stacked */}
          <div className='flex flex-row gap-6'>
            {/* Large card on left */}
            <div className='flex-1'>
              {posts[0] && (
                <BlogCard
                  key={posts[0].id}
                  post={posts[0]}
                  direction="column"
                />
              )}
            </div>

            {/* Two stacked cards on right */}
            <div className='flex flex-1 flex-col gap-6'>
              {posts[1] && (
                <BlogCard
                  key={posts[1].id}
                  post={posts[1]}
                  direction="row"
                />
              )}
              {posts[2] && (
                <BlogCard
                  key={posts[2].id}
                  post={posts[2]}
                  direction="row"
                />
              )}
            </div>
          </div>

          {/* Second row: 1 wide card */}
          {posts[3] && (
            <div className='flex flex-1'>
              <BlogCard
                key={posts[3].id}
                post={posts[3]}
                direction="row"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tablet Layout (sm to md) */}
      <div className="hidden sm:block md:hidden">
        <div className='flex flex-col gap-6'>
          {posts[0] && (
            <BlogCard
              key={posts[0].id}
              post={posts[0]}
              direction="column"
            />
          )}

          <div className='flex flex-col gap-6'>
            {posts[1] && (
              <BlogCard
                key={posts[1].id}
                post={posts[1]}
                direction="row"
              />
            )}
            {posts[2] && (
              <BlogCard
                key={posts[2].id}
                post={posts[2]}
                direction="row"
              />
            )}
          </div>

          {posts[3] && (
            <BlogCard
              key={posts[3].id}
              post={posts[3]}
              direction="column"
            />
          )}
        </div>
      </div>

      {/* Mobile Layout (below sm) */}
      <div className="block sm:hidden">
        <div className='flex flex-col gap-6'>
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              direction="column"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentBlogPosts;