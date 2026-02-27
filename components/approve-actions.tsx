"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { getErrorMessage } from "@/lib/errors"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ApproveActionsProps {
  listingId: string
}

export function ApproveActions({ listingId }: ApproveActionsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleAction = async (action: "approve" | "reject") => {
    setLoading(action)
    setError("")
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json().catch(() => null)
        setError(getErrorMessage(data?.error))
      }
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => handleAction("approve")}
          disabled={loading !== null}
        >
          {loading === "approve" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "Approve"
          )}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleAction("reject")}
          disabled={loading !== null}
        >
          {loading === "reject" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "Reject"
          )}
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
