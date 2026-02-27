"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthGateLink } from "@/components/auth-gate"

interface ListingDetailProps {
  listing: {
    id: string
    title: string
    rentDisplay: string
    rent: number
    bedrooms: number
    bathrooms: number
    area: string
    moveInDate: string
    durationMonths: number | null
    description: string
    photos: string[] | string
    contactPreference: string
    featured: boolean
    user: { id: string; name: string | null; email: string; phone?: string | null }
  }
  currentUserId: string | null
  isAdmin: boolean
  canAct: boolean
}

export function ListingDetail({ listing, currentUserId, isAdmin, canAct }: ListingDetailProps) {
  const photos = Array.isArray(listing.photos) ? listing.photos : (() => { try { return JSON.parse(listing.photos || "[]"); } catch { return []; } })()
  const isOwner = currentUserId ? listing.user.id === currentUserId : false
  const date = new Date(listing.moveInDate)
  const moveInStr = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/feed" className="text-sm text-muted hover:text-garnet transition-colors inline-block mb-2">
        ← Back to listings
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{listing.title}</h1>
          <p className="text-2xl font-bold text-garnet mt-2">{listing.rentDisplay}/mo</p>
          <div className="flex gap-2 mt-2">
            {listing.featured && <Badge className="bg-gold text-foreground border-0">Featured</Badge>}
            <Badge variant="secondary" className="border-garnet/20">FSU Email Verified</Badge>
          </div>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div>
            <p className="text-sm text-muted">Area</p>
            <p className="font-medium">{listing.area}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Move-in date</p>
            <p className="font-medium">{moveInStr}</p>
          </div>
          {listing.durationMonths && (
            <div>
              <p className="text-sm text-muted">Lease duration</p>
              <p className="font-medium">{listing.durationMonths} months</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted">Details</p>
            <p className="font-medium">
              {listing.bedrooms} bed · {listing.bathrooms} bath
            </p>
          </div>
          <div>
            <p className="text-sm text-muted">Contact preference</p>
            <p className="font-medium capitalize">{listing.contactPreference.replace("_", " ")}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Description</p>
            <p className="whitespace-pre-wrap">{listing.description}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Posted by</p>
            <p className="font-medium">{listing.user.name ?? "FSU User"}</p>
            {canAct ? (
              <>
                <p className="text-xs text-muted">FSU Email Verified</p>
                {listing.contactPreference === "email" && (
                  <p className="text-sm mt-1">
                    <a href={`mailto:${listing.user.email}`} className="text-garnet hover:underline">
                      {listing.user.email}
                    </a>
                  </p>
                )}
                {listing.contactPreference === "phone" && listing.user.phone && (
                  <p className="text-sm mt-1">
                    <a href={`tel:${listing.user.phone}`} className="text-garnet hover:underline">
                      {listing.user.phone}
                    </a>
                  </p>
                )}
                {listing.contactPreference === "platform_message" && (
                  <p className="text-sm mt-1 text-muted">Contact via platform messaging</p>
                )}
              </>
            ) : (
              <p className="text-sm mt-2">
                <AuthGateLink href={`/listings/${listing.id}`} variant="link">
                  Sign in to contact
                </AuthGateLink>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {(isOwner || isAdmin) && (
        <div className="flex gap-2 pt-2">
          {isAdmin && (
            <Button variant="outline" asChild className="border-garnet/30 text-garnet hover:bg-garnet/10">
              <Link href={`/admin/listings?highlight=${listing.id}`}>View in admin</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
