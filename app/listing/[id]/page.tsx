import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Calendar, Users, ArrowLeft } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ContactButton } from "@/components/contact-button"
import { ListingActions } from "@/components/listing-actions"
import { siteContent } from "@/content/siteContent"

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      select: { title: true, priceDisplay: true, locationCity: true },
    })
    if (!listing) return { title: "Listing" }
    return {
      title: `${listing.title} · ${listing.priceDisplay} | LeaseU`,
      description: `${listing.title} — ${listing.priceDisplay}/mo in ${listing.locationCity}. Find campus housing on LeaseU.`,
    }
  } catch {
    return { title: "Listing | LeaseU" }
  }
}

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

  const listingTypeLabels = siteContent.listingDetail.typeLabels

  const isOwner = session?.user.id === listing.hostId
  const isHost = session?.user.role === "HOST" || session?.user.role === "ADMIN"

  const availableStr = new Date(listing.availableDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-bg_right">
      <Nav />
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-5xl">
        <Link
          href={`/u/${listing.universitySlug}`}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {listing.universitySlug.toUpperCase()} listings
        </Link>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10">
          {/* Main Content */}
          <div>
            <div className="relative w-full aspect-[16/10] bg-bg_left rounded-2xl overflow-hidden mb-6 shadow-card">
              <Image
                src={listing.coverImageUrl || "https://via.placeholder.com/800x500"}
                alt={listing.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <Card className="mb-6 overflow-hidden border-border-soft shadow-card">
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-serif font-bold mb-3 text-text-primary">
                      {listing.title}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary" className="font-medium">
                        {listingTypeLabels[listing.listingType] ?? listing.listingType}
                      </Badge>
                      {listing.verifiedStudentOnly && (
                        <Badge variant="default">{siteContent.listingDetail.verifiedBadge}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ListingActions listingId={listing.id} title={listing.title} />
                    <div className="text-2xl lg:text-3xl font-bold text-accent tabular-nums">
                      {listing.priceDisplay}
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 p-4 rounded-xl bg-bg_right/80 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2 shadow-input">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted">{siteContent.listingDetail.locationLabel}</div>
                      <div className="font-medium">
                        {listing.locationCity}, {listing.locationState}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2 shadow-input">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted">{siteContent.listingDetail.availableLabel}</div>
                      <div className="font-medium">{availableStr}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2 shadow-input">
                      <Users className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted">{siteContent.listingDetail.roomsLabel}</div>
                      <div className="font-medium">
                        {listing.beds} bed{listing.beds !== 1 ? "s" : ""} · {listing.baths} bath
                        {listing.baths !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-text-primary">{siteContent.listingDetail.descriptionLabel}</h2>
                  <p className="text-text-muted whitespace-pre-wrap leading-relaxed">
                    {listing.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit space-y-6">
            <Card className="border-border-soft shadow-card">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">{siteContent.listingDetail.contactHostTitle}</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-text-muted mb-1">{siteContent.listingDetail.postedByLabel}</div>
                    <div className="font-medium">{listing.host.name || siteContent.listingDetail.anonymousHost}</div>
                  </div>
                  <ContactButton
                    listingId={listing.id}
                    hostId={listing.hostId}
                    isOwner={isOwner}
                    isAuthenticated={!!session}
                  />
                  {isOwner && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/host/listings/${listing.id}/edit`}>{siteContent.listingDetail.editListingButton}</Link>
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
