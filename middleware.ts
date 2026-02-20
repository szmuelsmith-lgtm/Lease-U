import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin routes
    if (path.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    // Host routes
    if (path.startsWith("/host")) {
      if (token?.role !== "HOST" && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Allow public routes
        if (
          path === "/" ||
          path.startsWith("/u/") ||
          path.startsWith("/listing/") ||
          path === "/login" ||
          path === "/signup" ||
          path.startsWith("/api/")
        ) {
          return true
        }

        // Require auth for protected routes
        if (path.startsWith("/admin")) {
          return token?.role === "ADMIN"
        }

        if (path.startsWith("/host")) {
          return token?.role === "HOST" || token?.role === "ADMIN"
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/host/:path*"],
}
