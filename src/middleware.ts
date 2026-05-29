import { NextRequest, NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/verify_otp",
  "/auth/forget_password",
];

// Define routes that require authentication
const protectedRoutes = [
  "/admin-dashboard",
  "/admin-dashboard/buyers",
  "/admin-dashboard/sellers",
  "/admin-dashboard/finance",
  "/admin-dashboard/livestream",
  "/admin-dashboard/reports",
  "/admin-dashboard/settings",
  "/logistics",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the auth token and user role from cookies
  const authToken = request.cookies.get("authToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  const isAuthenticated = !!authToken;
  const isAuthRoute = pathname.startsWith("/auth");
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(pathname);

  console.log("Middleware check:", {
    pathname,
    isAuthenticated,
    isAuthRoute,
    isProtectedRoute,
    isPublicRoute,
    userRole,
  });

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    console.log("Redirecting authenticated user from auth page based on role");
    if (userRole === "HUB_ADMIN" || userRole === "hub-admin") {
      return NextResponse.redirect(new URL("/logistics/lagos", request.url));
    }
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }

  // Protect admin-dashboard from HUB_ADMIN at the middleware level to prevent flashing
  if (isAuthenticated && pathname.startsWith("/admin-dashboard")) {
    if (userRole === "HUB_ADMIN" || userRole === "hub-admin") {
      return NextResponse.redirect(new URL("/logistics/lagos", request.url));
    }
  }

  // Redirect unauthenticated users from protected routes to login
  if (!isAuthenticated && isProtectedRoute) {
    console.log(
      "Redirecting unauthenticated user from protected route to login"
    );
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Allow access to public routes and authenticated access to protected routes
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
