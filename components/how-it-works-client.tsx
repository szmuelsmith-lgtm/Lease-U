"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HowItWorksClient() {
  return (
    <Button
      variant="outline"
      className="border-garnet/30 text-garnet hover:bg-garnet/10"
      asChild
    >
      <Link href="/login">Sign in</Link>
    </Button>
  )
}
