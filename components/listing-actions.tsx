"use client"

import { useState } from "react"
import Link from "next/link"
import { getErrorMessage } from "@/lib/errors"
import { siteContent } from "@/content/siteContent"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export function ListingActions({
  listingId,
  hostId,
  canMessage,
  eduVerified,
  currentUserId,
}: {
  listingId: string
  hostId: string
  canMessage: boolean
  eduVerified?: boolean
  currentUserId?: string
}) {
  const [messageOpen, setMessageOpen] = useState(false)
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState("")
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportSent, setReportSent] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)
  const [reportError, setReportError] = useState("")

  async function sendMessage() {
    setLoading(true)
    setSendError("")
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, toUserId: hostId, body }),
      })
      if (res.ok) {
        setSent(true)
        setBody("")
        setTimeout(() => setMessageOpen(false), 1500)
      } else {
        const data = await res.json().catch(() => null)
        setSendError(getErrorMessage(data?.error) || "Failed to send message. Please try again.")
      }
    } catch {
      setSendError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function sendReport() {
    setReportLoading(true)
    setReportError("")
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, reason: reportReason }),
      })
      if (res.ok) {
        setReportSent(true)
        setTimeout(() => setReportOpen(false), 1500)
      } else {
        const data = await res.json().catch(() => null)
        setReportError(getErrorMessage(data?.error) || "Failed to submit report.")
      }
    } catch {
      setReportError("Network error. Please try again.")
    } finally {
      setReportLoading(false)
    }
  }

  if (currentUserId === hostId) return null

  if (!canMessage) {
    return (
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-muted text-sm mb-2">{siteContent.listingActions.signInPrompt}</p>
        <Button asChild>
          <Link href={`/login?callbackUrl=/listings/${listingId}`}>{siteContent.listingActions.signInButton}</Link>
        </Button>
      </div>
    )
  }

  if (!eduVerified) {
    return (
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-muted text-sm mb-2">
          {siteContent.listingActions.eduOnlyPrompt}
        </p>
        <Button variant="outline" disabled>
          {siteContent.listingActions.messageHostButton}
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-6 pt-6 border-t border-border flex gap-3">
      <Button onClick={() => setMessageOpen(true)}>{siteContent.listingActions.messageHostButton}</Button>
      <Button variant="outline" size="sm" onClick={() => setReportOpen(true)}>
        {siteContent.listingActions.reportButton}
      </Button>

      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{siteContent.listingActions.messageDialogTitle}</DialogTitle>
            <DialogDescription>{siteContent.listingActions.messageDialogDescription}</DialogDescription>
          </DialogHeader>
          {sent ? (
            <p className="text-garnet font-medium">{siteContent.listingActions.messageSent}</p>
          ) : (
            <>
              <div>
                <Label htmlFor="body">{siteContent.listingActions.messageLabel}</Label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-border px-3 py-2 mt-1"
                  placeholder={siteContent.listingActions.messagePlaceholder}
                />
              </div>
              {sendError && <p className="text-sm text-red-600">{sendError}</p>}
              <Button onClick={sendMessage} disabled={loading || !body.trim()}>
                {loading ? siteContent.listingActions.sendLoading : siteContent.listingActions.sendButton}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{siteContent.listingActions.reportDialogTitle}</DialogTitle>
            <DialogDescription>{siteContent.listingActions.reportDialogDescription}</DialogDescription>
          </DialogHeader>
          {reportSent ? (
            <p className="text-garnet font-medium">{siteContent.listingActions.reportSent}</p>
          ) : (
            <>
              <div>
                <Label htmlFor="reportReason">{siteContent.listingActions.reportReasonLabel}</Label>
                <textarea
                  id="reportReason"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-border px-3 py-2 mt-1"
                  placeholder={siteContent.listingActions.reportReasonPlaceholder}
                />
              </div>
              {reportError && <p className="text-sm text-red-600">{reportError}</p>}
              <Button onClick={sendReport} disabled={reportLoading || !reportReason.trim()}>
                {reportLoading ? siteContent.listingActions.reportSubmitLoading : siteContent.listingActions.reportSubmitButton}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
