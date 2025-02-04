import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the path the user is trying to access
  const path = request.nextUrl.pathname;

  // Get the token from the cookie
  const isAuthenticated = request.cookies.get("jwt")?.value;

  // Define protected routes
  const protectedRoutes = ["/profile"];
  const isProtectedRoute = protectedRoutes.includes(path);

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Return the response
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: "/profile",
};
