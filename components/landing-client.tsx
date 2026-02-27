"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LandingClient() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-lg text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            LeaseU <span className="text-garnet">@</span> FSU
          </h1>
          <p className="text-muted text-lg">
            Campus housing for Florida State University. Sublets, lease takeovers, and rooms — verified by FSU email.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            size="lg"
            className="bg-garnet hover:bg-garnet/90 text-white text-lg px-8 py-6"
            asChild
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <p className="text-sm text-muted">
            Only @fsu.edu emails accepted. Your email must be verified.
          </p>
          <Link
            href="/browse"
            className="text-sm text-garnet hover:underline font-medium"
          >
            Browse listings without signing in
          </Link>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted">
            By signing in, you agree to use your verified FSU email. Non-FSU accounts are not permitted.
          </p>
        </div>
      </div>
    </div>
  )
}
