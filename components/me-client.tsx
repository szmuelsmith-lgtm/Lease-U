"use client"

import Link from "next/link"
import { ListingCard } from "@/components/listing-card"
import { Badge } from "@/components/ui/badge"

interface MeClientProps {
  user: {
    name: string | null
    email: string
    listings: Array<{
      id: string
      title: string
      rentDisplay: string
      bedrooms: number
      bathrooms: number
      area: string
      moveInDate: string
      featured: boolean
      status: string
      user: { name: string | null; email: string }
    }>
  }
}

export function MeClient({ user }: MeClientProps) {
  const activeListings = user.listings.filter((l) => l.status === "active")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My profile</h1>
        <p className="text-muted">{user.email}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-garnet-muted text-garnet">FSU Email Verified</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">My listings</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={{
                ...listing,
                user: { name: user.name, email: user.email },
              }}
            />
          ))}
        </div>
        {activeListings.length === 0 && (
          <p className="text-muted">
            No listings yet. <Link href="/listings/new" className="text-garnet hover:underline">Create one</Link>
          </p>
        )}
      </div>
    </div>
  )
}
