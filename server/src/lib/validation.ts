/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim().toLowerCase());
};

/**
 * Validates password strength
 * Returns null if valid, error message if invalid
 */
export const validatePassword = (password: string): string | null => {
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }

  return null;
};

/**
 * Validates and sanitizes string input
 */
export const sanitizeString = (
  input: string,
  maxLength: number = 255
): string => {
  return input.trim().slice(0, maxLength);
};

/**
 * Validates URL format
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates slug format (lowercase, hyphens, no spaces)
 */
export const validateSlug = (slug: string): boolean => {
  const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return regex.test(slug);
};

/**
 * Generates a slug from a string
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

/**
 * Validates image file format
 */
export const validateImageFormat = (base64: string): boolean => {
  const validFormats = [
    "data:image/jpeg",
    "data:image/jpg",
    "data:image/png",
    "data:image/gif",
    "data:image/webp",
  ];
  return validFormats.some((format) => base64.startsWith(format));
};

/**
 * Validates image size (in base64 string)
 */
export const validateImageSize = (
  base64: string,
  maxSizeMB: number = 5
): boolean => {
  // Calculate size from base64 string
  const base64Length = base64.split(",")[1]?.length || 0;
  const sizeInBytes = (base64Length * 3) / 4;
  const sizeInMB = sizeInBytes / (1024 * 1024);

  return sizeInMB <= maxSizeMB;
};

/**
 * Rate limiting helper - checks if action is allowed
 */
interface RateLimitStore {
  [key: string]: { count: number; resetAt: number };
}

const rateLimitStore: RateLimitStore = {};

export const checkRateLimit = (
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): boolean => {
  const now = Date.now();
  const record = rateLimitStore[key];

  if (!record || now > record.resetAt) {
    rateLimitStore[key] = {
      count: 1,
      resetAt: now + windowMs,
    };
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
};

/**
 * Cleans up expired rate limit records
 */
export const cleanupRateLimitStore = () => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetAt < now) {
      delete rateLimitStore[key];
    }
  });
};

// Run cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
