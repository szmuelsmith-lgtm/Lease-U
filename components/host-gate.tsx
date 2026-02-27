"use client"

import { useAuth } from "@/app/providers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { siteContent } from "@/content/siteContent"

export function HostGate() {
  const { user } = useAuth()
  const [open, setOpen] = useState(true)

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-foreground mb-4">{siteContent.hostGate.signInTitle}</h2>
        <p className="text-muted mb-6">{siteContent.hostGate.signInDescription}</p>
        <Button asChild>
          <Link href="/login?callbackUrl=/post">{siteContent.hostGate.signInButton}</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-foreground mb-4">{siteContent.hostGate.verifiedTitle}</h2>
        <p className="text-muted mb-6">
          {siteContent.hostGate.verifiedDescription}
        </p>
        <Button variant="outline" onClick={() => setOpen(true)}>
          {siteContent.hostGate.learnMore}
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{siteContent.hostGate.dialogTitle}</DialogTitle>
            <DialogDescription>
              {siteContent.hostGate.dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <Button asChild>
            <Link href="/browse">{siteContent.hostGate.dialogCTA}</Link>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
