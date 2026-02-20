import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import { MapPin, Calendar, Users, Mail } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ContactButton } from "@/components/contact-button"

export default async function ListingDetail({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  if (!listing) notFound()

  const listingTypeLabels: Record<string, string> = {
    SUBLET: "Sublet",
    LEASE_TAKEOVER: "Lease Takeover",
    ROOM: "Room Rental",
  }

  const isOwner = session?.user.id === listing.hostId
  const isHost = session?.user.role === "HOST" || session?.user.role === "ADMIN"

  return (
    <div className="min-h-screen bg-bg_right">
      <Nav />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-[60%_40%] gap-8">
          {/* Main Content */}
          <div>
            <div className="relative w-full h-96 bg-bg_left rounded-lg overflow-hidden mb-6">
              <Image
                src={listing.coverImageUrl || "https://via.placeholder.com/800x600"}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">
                      {listing.title}
                    </h1>
                    <div className="flex gap-2 mb-4">
                      <Badge variant="secondary">
                        {listingTypeLabels[listing.listingType]}
                      </Badge>
                      {listing.verifiedStudentOnly && (
                        <Badge variant="default">Verified Students Only</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-3xl font-bold">
                    {listing.priceDisplay}
                  </div>
                </div>

                <div className="space-y-3 mb-6 text-text-muted">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>
                      {listing.locationCity}, {listing.locationState}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>
                      Available {new Date(listing.availableDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>
                      {listing.beds} bed{listing.beds !== 1 ? "s" : ""} · {listing.baths} bath
                      {listing.baths !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-text-muted whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Host</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-text-muted mb-1">Posted by</div>
                    <div className="font-medium">{listing.host.name || "Anonymous"}</div>
                  </div>
                  <ContactButton
                    listingId={listing.id}
                    hostId={listing.hostId}
                    isOwner={isOwner}
                    isAuthenticated={!!session}
                  />
                  {isOwner && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`/host/listings/${listing.id}/edit`}>Edit Listing</a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
