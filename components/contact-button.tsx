"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthModal } from "./auth-modal"
import { useAuth } from "@/app/providers"
import { useRouter } from "next/navigation"

interface ContactButtonProps {
  listingId: string
  hostId: string
  isOwner: boolean
  isAuthenticated: boolean
}

export function ContactButton({
  listingId,
  hostId,
  isOwner,
  isAuthenticated,
}: ContactButtonProps) {
  const [showAuth, setShowAuth] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  if (isOwner) {
    return (
      <Button variant="outline" className="w-full" disabled>
        This is your listing
      </Button>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <Button className="w-full" onClick={() => setShowAuth(true)}>
          Contact Host
        </Button>
        <AuthModal open={showAuth} onOpenChange={setShowAuth} />
      </>
    )
  }

  const handleContact = async () => {
    router.push(`/messages?listing=${listingId}`)
  }

  return (
    <Button className="w-full" onClick={handleContact}>
      Message Host
    </Button>
  )
}
