"use client"

import { useAuth } from "@/app/providers"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function SignInModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            Sign in with your @fsu.edu email to post listings, contact hosts, and more.
          </DialogDescription>
        </DialogHeader>
        <Button asChild className="bg-garnet hover:bg-garnet/90">
          <Link href="/login">Sign in</Link>
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export function AuthGate({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  const [open, setOpen] = useState(false)

  if (loading) return fallback ?? <span className="animate-pulse">...</span>

  if (user && profile) {
    const isFSU = profile.email.toLowerCase().endsWith("@fsu.edu")
    if (!isFSU) {
      return (
        <div className="text-sm text-muted">
          Access restricted to verified @fsu.edu accounts.
        </div>
      )
    }
    return <>{children}</>
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer inline-block">
        {children}
      </div>
      <SignInModal open={open} onOpenChange={setOpen} />
    </>
  )
}

export function AuthGateLink({
  href,
  children,
  variant = "button",
}: {
  href: string
  children: React.ReactNode
  variant?: "button" | "link"
}) {
  const { user, profile, loading } = useAuth()
  const [open, setOpen] = useState(false)

  const linkClass = variant === "link" ? "text-garnet hover:underline font-medium" : ""

  if (loading) {
    return variant === "link" ? (
      <span className={linkClass}>{children}</span>
    ) : (
      <Button disabled>{children}</Button>
    )
  }

  if (user && profile?.email?.toLowerCase().endsWith("@fsu.edu")) {
    if (variant === "button") {
      return (
        <Button asChild>
          <Link href={href}>{children}</Link>
        </Button>
      )
    }
    return (
      <Link href={href} className={linkClass}>
        {children}
      </Link>
    )
  }

  if (variant === "link") {
    return (
      <>
        <button type="button" onClick={() => setOpen(true)} className={linkClass}>
          {children}
        </button>
        <SignInModal open={open} onOpenChange={setOpen} />
      </>
    )
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        {children}
      </Button>
      <SignInModal open={open} onOpenChange={setOpen} />
    </>
  )
}
