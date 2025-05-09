import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the user is authenticated
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/api/auth", "/api/uploadthing"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicRoute) {
    // Redirect to login page
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // If the user is authenticated and trying to access login page
  if (isAuthenticated && pathname === "/login") {
    // Redirect to home page
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (Next Auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|api/uploadthing|_next/static|_next/image|favicon.ico).*)",
  ],
};
