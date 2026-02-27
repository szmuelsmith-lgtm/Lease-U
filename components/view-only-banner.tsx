"use client"

import { useAuth } from "@/app/providers"
import Link from "next/link"

export function ViewOnlyBanner() {
  const { user, loading } = useAuth()
  if (loading || user) return null

  return (
    <div className="bg-gold/20 border-b border-gold/40 py-2.5 px-4 text-center text-sm text-foreground">
      You&apos;re in view-only mode —{" "}
      <Link href="/login" className="font-semibold text-garnet hover:underline">
        Sign in
      </Link>{" "}
      to post listings or contact hosts.
    </div>
  )
}
