"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { getErrorMessage } from "@/lib/errors"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { siteContent } from "@/content/siteContent"

type Listing = {
  id: string
  title: string
  priceDisplay: string
  coverImageUrl: string | null
  beds: number
  baths: number
  status: string
  host?: { name: string | null; email: string }
}

export function AdminClient({
  pending,
  approved,
  removed,
  reports,
  siteSettings = {},
}: {
  pending: Listing[]
  approved: Listing[]
  removed: Listing[]
  reports: Array<{
    id: string
    reason: string | null
    details?: string | null
    createdAt: Date
    listing?: Listing
    user: { email: string }
  }>
  siteSettings?: Record<string, string>
}) {
  const [tab, setTab] = useState("pending")
  const [images, setImages] = useState({
    heroImage: siteSettings?.heroImage ?? "/images/hero-campus.jpg",
    builtForStudentsImage: siteSettings?.builtForStudentsImage ?? "/images/housing-exterior.jpg",
    listingFallbackImage: siteSettings?.listingFallbackImage ?? "/images/listing-fallback.jpg",
  })
  const [imagesSaving, setImagesSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  function showFeedback(type: "success" | "error", message: string) {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3000)
  }

  async function saveSiteImages() {
    setImagesSaving(true)
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(images),
      })
      if (res.ok) {
        showFeedback("success", "Site images saved")
        window.location.reload()
      } else {
        const data = await res.json().catch(() => null)
        showFeedback("error", getErrorMessage(data?.error))
      }
    } catch (e) {
      showFeedback("error", getErrorMessage(e))
    } finally {
      setImagesSaving(false)
    }
  }

  async function adminAction(id: string, action: "approve" | "reject" | "remove") {
    setActionLoading(`${action}-${id}`)
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        showFeedback("success", `Listing ${action}d successfully`)
        window.location.reload()
      } else {
        const data = await res.json().catch(() => null)
        showFeedback("error", getErrorMessage(data?.error))
      }
    } catch (e) {
      showFeedback("error", getErrorMessage(e))
    } finally {
      setActionLoading(null)
    }
  }

  function ListingCard({
    l,
    showApproveReject,
    showRemove,
  }: {
    l: Listing
    showApproveReject?: boolean
    showRemove?: boolean
  }) {
    return (
      <div className="rounded-radius-2xl border border-border bg-white p-6 flex gap-4 shadow-premium hover:shadow-premiumHover transition-all duration-220">
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          {l.coverImageUrl ? (
            <Image src={l.coverImageUrl} alt="" width={96} height={96} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{l.title}</h3>
          <p className="text-garnet font-medium">{l.priceDisplay}</p>
          <p className="text-sm text-muted">
            {l.beds} bed · {l.baths} bath · {l.host?.name ?? l.host?.email ?? "FSU Student"}
          </p>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/listings/${l.id}`}>View</Link>
            </Button>
            {showApproveReject && (
              <>
                <Button
                  size="sm"
                  onClick={() => adminAction(l.id, "approve")}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === `approve-${l.id}` ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Approve"
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => adminAction(l.id, "reject")}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === `reject-${l.id}` ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Reject"
                  )}
                </Button>
              </>
            )}
            {showRemove && l.status === "approved" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => adminAction(l.id, "remove")}
                disabled={actionLoading !== null}
              >
                {actionLoading === `remove-${l.id}` ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Remove"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">{siteContent.admin.heading}</h1>

        {feedback && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
              feedback.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {feedback.message}
          </div>
        )}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">{siteContent.admin.tabs.pending} ({pending.length})</TabsTrigger>
            <TabsTrigger value="approved">{siteContent.admin.tabs.approved} ({approved.length})</TabsTrigger>
            <TabsTrigger value="removed">{siteContent.admin.tabs.removed} ({removed.length})</TabsTrigger>
            <TabsTrigger value="reports">{siteContent.admin.tabs.reports} ({reports.length})</TabsTrigger>
            <TabsTrigger value="site-images">{siteContent.admin.tabs.siteImages}</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="space-y-4">
            {pending.map((l) => (
              <ListingCard key={l.id} l={l} showApproveReject />
            ))}
            {pending.length === 0 && <p className="text-muted">{siteContent.admin.emptyPending}</p>}
          </TabsContent>
          <TabsContent value="approved" className="space-y-4">
            {approved.map((l) => (
              <ListingCard key={l.id} l={l} showRemove />
            ))}
            {approved.length === 0 && <p className="text-muted">{siteContent.admin.emptyApproved}</p>}
          </TabsContent>
          <TabsContent value="removed" className="space-y-4">
            {removed.map((l) => (
              <ListingCard key={l.id} l={l} />
            ))}
            {removed.length === 0 && <p className="text-muted">{siteContent.admin.emptyRemoved}</p>}
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            {reports.map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-white p-4">
                <p className="text-sm text-muted">Reported by {r.user.email}</p>
                <p className="text-sm text-muted">Reason: {r.reason ?? "—"}</p>
                {r.listing && <ListingCard l={r.listing} showRemove />}
              </div>
            ))}
            {reports.length === 0 && <p className="text-muted">{siteContent.admin.emptyReports}</p>}
          </TabsContent>
          <TabsContent value="site-images" className="space-y-6">
            <div className="rounded-radius-2xl border border-border bg-white p-6 shadow-premium max-w-2xl">
              <h2 className="text-lg font-semibold text-foreground mb-4">{siteContent.admin.siteImagesTitle}</h2>
              <p className="text-sm text-muted mb-6">
                {siteContent.admin.siteImagesDescription}
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="heroImage">{siteContent.admin.heroImageLabel}</Label>
                  <Input
                    id="heroImage"
                    value={images.heroImage}
                    onChange={(e) => setImages((p) => ({ ...p, heroImage: e.target.value }))}
                    placeholder="/images/hero-campus.jpg"
                    className="mt-1 rounded-radius-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="builtForStudentsImage">{siteContent.admin.builtForStudentsImageLabel}</Label>
                  <Input
                    id="builtForStudentsImage"
                    value={images.builtForStudentsImage}
                    onChange={(e) => setImages((p) => ({ ...p, builtForStudentsImage: e.target.value }))}
                    placeholder="/images/housing-exterior.jpg"
                    className="mt-1 rounded-radius-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="listingFallbackImage">{siteContent.admin.listingFallbackImageLabel}</Label>
                  <Input
                    id="listingFallbackImage"
                    value={images.listingFallbackImage}
                    onChange={(e) => setImages((p) => ({ ...p, listingFallbackImage: e.target.value }))}
                    placeholder="/images/listing-fallback.jpg"
                    className="mt-1 rounded-radius-xl"
                  />
                </div>
                <Button onClick={saveSiteImages} disabled={imagesSaving}>
                  {imagesSaving ? siteContent.admin.savingImagesButton : siteContent.admin.saveImagesButton}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
