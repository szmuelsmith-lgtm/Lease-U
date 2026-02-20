"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { MapPin, Calendar, Users } from "lucide-react"
import { Listing } from "@prisma/client"

interface ListingCardProps {
  listing: Listing & { host: { name: string | null } }
  index?: number
}

export function ListingCard({ listing, index = 0 }: ListingCardProps) {
  const listingTypeLabels: Record<string, string> = {
    SUBLET: "Sublet",
    LEASE_TAKEOVER: "Lease Takeover",
    ROOM: "Room Rental",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.26,
        delay: index * 0.055,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-shadow">
        <div className="relative w-full h-48 bg-bg_left rounded-t-lg overflow-hidden">
          <Image
            src={listing.coverImageUrl || "https://via.placeholder.com/400x300"}
            alt={listing.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge variant="secondary">
              {listingTypeLabels[listing.listingType]}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {listing.title}
          </h3>
          <div className="space-y-1 mb-3 text-sm text-text-muted">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>
                {listing.locationCity}, {listing.locationState}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Available {new Date(listing.availableDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {listing.beds} bed{listing.beds !== 1 ? "s" : ""} · {listing.baths} bath
                {listing.baths !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="mt-auto">
            <div className="text-2xl font-bold mb-2">
              {listing.priceDisplay}
            </div>
            <Link href={`/listing/${listing.id}`}>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
