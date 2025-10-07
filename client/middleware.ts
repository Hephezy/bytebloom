import { auth } from "@/auth";

export default auth;

// Protect these routes - require authentication
export const config = {
  matcher: [
    "/blog/new",
    "/blog/:id/edit",
    "/dashboard/:path*",
    "/profile/:path*",
  ],
};
