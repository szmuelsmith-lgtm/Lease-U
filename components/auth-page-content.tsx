"use client"

import { useRouter } from "next/navigation"
import { AuthModal } from "./auth-modal"
import Link from "next/link"

export function AuthPageContent({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter()

  return (
    <>
      <AuthModal
        open={true}
        onOpenChange={(open) => {
          if (!open) router.push("/")
        }}
        mode={mode}
      />
      <Link href="/" className="mt-8 text-sm text-text-muted hover:text-accent transition-colors">
        ← Back to home
      </Link>
    </>
  )
}
