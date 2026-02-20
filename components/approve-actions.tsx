"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ApproveActionsProps {
  listingId: string
}

export function ApproveActions({ listingId }: ApproveActionsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleAction = async (action: "approve" | "reject") => {
    setLoading(action)
    try {
      const res = await fetch(`/api/admin/listings/${listingId}/${action}`, {
        method: "POST",
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      alert("Failed to update listing")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() => handleAction("approve")}
        disabled={loading !== null}
      >
        {loading === "approve" ? "..." : "Approve"}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleAction("reject")}
        disabled={loading !== null}
      >
        {loading === "reject" ? "..." : "Reject"}
      </Button>
    </div>
  )
}
