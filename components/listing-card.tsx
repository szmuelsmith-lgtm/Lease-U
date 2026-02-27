"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ListingCardProps {
  listing: {
    id: string
    title: string
    rentDisplay: string
    bedrooms: number
    bathrooms: number
    area: string
    moveInDate: string
    featured: boolean
    user: { name: string | null; email: string }
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  const date = new Date(listing.moveInDate)
  const moveInStr = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="h-full hover:shadow-lg hover:border-garnet/30 transition-all duration-200 border-border">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-semibold text-foreground line-clamp-2">{listing.title}</h3>
            {listing.featured && (
              <Badge className="bg-gold text-foreground shrink-0 border-0">Featured</Badge>
            )}
          </div>
          <p className="text-2xl font-bold text-garnet mb-3">{listing.rentDisplay}/mo</p>
          <p className="text-sm font-medium text-foreground mb-1">{listing.area}</p>
          <p className="text-sm text-muted">
            {listing.bedrooms} bed · {listing.bathrooms} bath · Move-in {moveInStr}
          </p>
          <p className="text-xs text-gold mt-3 font-medium">FSU Email Verified</p>
        </CardContent>
      </Card>
    </Link>
  )
}
