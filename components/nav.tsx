"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function Nav() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b border-border-soft bg-surface-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-semibold">LeaseU.edu</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-accent text-white"
                  : "hover:bg-accent-soft text-text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/u/fsu"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive("/u/fsu") || pathname?.startsWith("/u/")
                  ? "bg-accent text-white"
                  : "hover:bg-accent-soft text-text-primary"
              }`}
            >
              Browse
            </Link>
            <Link
              href="/host/new"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive("/host/new") || pathname?.startsWith("/host/")
                  ? "bg-accent text-white"
                  : "hover:bg-accent-soft text-text-primary"
              }`}
            >
              Post
            </Link>
            <Link
              href="/messages"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive("/messages")
                  ? "bg-accent text-white"
                  : "hover:bg-accent-soft text-text-primary"
              }`}
            >
              Messages
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-sm text-text-muted">
                  {session.user.name || session.user.email}
                </span>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
