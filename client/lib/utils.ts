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

export function formatDate(
  dateString: string | number | null | undefined
): string {
  if (!dateString && dateString !== 0) {
    return "Invalid date";
  }

  try {
    let date: Date;

    // Handle Unix timestamp (number in milliseconds or seconds)
    if (typeof dateString === "number") {
      // JavaScript timestamps should be 13 digits (milliseconds)
      // Unix timestamps are 10 digits (seconds)
      const timestampStr = dateString.toString();

      // Debug logging
      console.log("formatDate DEBUG:", {
        input: dateString,
        length: timestampStr.length,
        type: typeof dateString,
      });

      if (timestampStr.length === 10) {
        // Seconds - convert to milliseconds
        date = new Date(dateString * 1000);
      } else if (timestampStr.length === 13) {
        // Milliseconds - use as is
        date = new Date(dateString);
      } else {
        // Invalid timestamp length - try anyway but log warning
        console.warn(
          `Unusual timestamp length: ${dateString} (length: ${timestampStr.length})`
        );
        date = new Date(dateString);
      }
    } else {
      // Handle string date (ISO format, etc.)
      console.log("formatDate - String input:", dateString);
      date = new Date(dateString);
    }

    // Additional debug for the created date
    console.log("Created date:", {
      dateObject: date,
      timestamp: date.getTime(),
      isValid: !isNaN(date.getTime()),
      formatted: date.toString(),
    });

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error(`Failed to create valid date from: ${dateString}`);
      return "Invalid date";
    }

    // Format the date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error, "Input was:", dateString);
    return "Invalid date";
  }
}

export function getRelativeTime(
  dateString: string | number | null | undefined
): string {
  if (!dateString && dateString !== 0) {
    return "Unknown time";
  }

  try {
    let date: Date;

    // Handle Unix timestamp (number in milliseconds or seconds)
    if (typeof dateString === "number") {
      const timestampStr = dateString.toString();

      if (timestampStr.length === 10) {
        // Seconds - convert to milliseconds
        date = new Date(dateString * 1000);
      } else if (timestampStr.length === 13) {
        // Milliseconds - use as is
        date = new Date(dateString);
      } else {
        // Invalid timestamp length
        console.warn(
          `Invalid timestamp format: ${dateString} (length: ${timestampStr.length})`
        );
        return "Unknown time";
      }
    } else {
      date = new Date(dateString);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date: ${dateString}`);
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
