"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Invite {
  id: string
  expiresAt: string
  maxUses: number
  uses: number
  revokedAt: string | null
  createdAt: string
  createdBy: { name: string | null; email: string }
}

export function AdminInvitesClient({ invites }: { invites: Invite[] }) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [newCode, setNewCode] = useState<string | null>(null)

  async function createInvite() {
    setCreating(true)
    setNewCode(null)
    const res = await fetch("/api/admin/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expiresInDays: 7, maxUses: 1 }),
    })
    const data = await res.json()
    setCreating(false)
    if (res.ok) {
      setNewCode(data.code)
      router.refresh()
    }
  }

  async function revoke(id: string) {
    await fetch(`/api/admin/invites/${id}/revoke`, { method: "POST" })
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <Button onClick={createInvite} disabled={creating}>
          {creating ? "Creating…" : "Generate invite code"}
        </Button>
        {newCode && (
          <div className="mt-4 p-4 rounded-lg bg-garnet-muted border border-garnet/20">
            <p className="text-sm font-medium text-garnet">Copy this code now — it won't be shown again:</p>
            <code className="block mt-2 p-2 bg-surface rounded text-sm break-all">{newCode}</code>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => navigator.clipboard.writeText(newCode)}
            >
              Copy
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {invites.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface"
          >
            <div>
              <p className="text-sm text-muted">
                Expires {new Date(inv.expiresAt).toLocaleDateString()} · {inv.uses}/{inv.maxUses} uses
              </p>
              <p className="text-xs text-muted">
                Created by {inv.createdBy.email} · {new Date(inv.createdAt).toLocaleString()}
              </p>
            </div>
            {!inv.revokedAt ? (
              <Button variant="outline" size="sm" onClick={() => revoke(inv.id)}>
                Revoke
              </Button>
            ) : (
              <span className="text-sm text-muted">Revoked</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
