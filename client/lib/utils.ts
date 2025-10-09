import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractDescription(
  content: string | null | undefined,
  maxLength: number = 150
): string {
  if (!content) return "";

  // Remove HTML tags if present
  const strippedContent = content.replace(/<[^>]*>/g, "");

  // Try to get first paragraph (split by double newlines or paragraph tags)
  const firstParagraph = strippedContent.split(/\n\n|\r\n\r\n/)[0];

  // If first paragraph is short enough, return it
  if (firstParagraph && firstParagraph.length <= maxLength) {
    return firstParagraph.trim();
  }

  // Otherwise, truncate to maxLength and add ellipsis
  const truncated = strippedContent.substring(0, maxLength).trim();

  // Find the last complete word
  const lastSpace = truncated.lastIndexOf(" ");
  const finalText =
    lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;

  return finalText + "...";
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return "Invalid date";
  }

  try {
    // Parse the date string
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string: ${dateString}`);
      return "Invalid date";
    }

    // Format the date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

export function getRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) {
    return "Unknown time";
  }

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string: ${dateString}`);
      return "Unknown time";
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Handle future dates
    if (diffInSeconds < 0) {
      return "In the future";
    }

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  } catch (error) {
    console.error("Error calculating relative time:", error);
    return "Unknown time";
  }
}

export function getReadingTime(content: string | null | undefined): string {
  if (!content) return "1 min read";

  try {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, "");

    const wordsPerMinute = 200;
    const words = plainText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

    return `${minutes} min read`;
  } catch (error) {
    console.error("Error calculating reading time:", error);
    return "1 min read";
  }
}
