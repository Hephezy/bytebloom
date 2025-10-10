import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Post } from '@/lib/graphql';
import { extractDescription, formatDate } from '@/lib/utils';

type LayoutDirection = 'row' | 'column';

interface BlogCardProps {
  post: Post;
  direction: LayoutDirection;
}

// Custom loader that bypasses Next.js optimization for external URLs
const customLoader = ({ src }: { src: string }) => {
  return src;
};

const BlogCard = ({ post, direction }: BlogCardProps) => {

  // Validate post data
  if (!post || !post.id) {
    return null;
  }

  const description = extractDescription(post.content, 150);
  const formattedDate = formatDate(post.createdAt);
  const category = post.categories?.[0];

  return (
    <Link href={`/blog/${post.id}`}>
      <Card
        className={`
          flex rounded-xl overflow-hidden
          ${direction === "column" ? "flex-col" : "flex-row"}
          bg-card hover:shadow-lg transition-shadow duration-300 cursor-pointer
          border border-border
        `}
      >
        {/* Image Section */}
        <div className={`
          relative overflow-hidden
          ${direction === "column" ? "w-full h-48" : "w-1/3 h-full min-h-[200px]"}
        `}>
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              loader={customLoader}
              unoptimized // Skip Next.js optimization for external images
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1">
          <CardHeader className="pb-3">
            {/* Category Badge */}
            <div className="mb-2">
              {category ? (
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                  {category.name}
                </span>
              ) : (
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-muted/10 text-muted rounded-full">
                  Uncategorized
                </span>
              )}
            </div>

            {/* Title */}
            <CardTitle className="text-xl font-bold text-foreground line-clamp-2 hover:text-primary transition-colors">
              {post.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="pb-3 flex-1">
            {/* Description */}
            <CardDescription className="text-muted-foreground line-clamp-3">
              {description}
            </CardDescription>
          </CardContent>

          <CardFooter className="pt-0">
            <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
              {/* Author */}
              <span className="font-medium">{post.author.name || 'Anonymous'}</span>

              {/* Date */}
              <span>{formattedDate}</span>
            </div>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;