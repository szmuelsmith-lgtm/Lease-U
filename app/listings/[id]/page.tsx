import { createClient } from "@/lib/supabase/server"
import { getSiteSettings } from "@/lib/site-settings"
import { transformListing } from "@/lib/transforms"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Nav } from "@/components/nav"
import { ListingActions } from "@/components/listing-actions"

export default async function ListingPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: row } = await supabase
    .from("listings")
    .select("*, host:profiles!host_id(id, email)")
    .eq("id", params.id)
    .single()

  if (!row) notFound()

  const listing = transformListing(row)

  const [{ data: { user } }, siteSettings] = await Promise.all([
    supabase.auth.getUser(),
    getSiteSettings(),
  ])

  let eduVerified = false
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("edu_verified")
      .eq("id", user.id)
      .single()
    eduVerified = profile?.edu_verified ?? false
  }

  const canMessage = !!user

  const typeLabels: Record<string, string> = {
    lease_takeover: "Lease Takeover",
    sublet: "Sublet",
    room: "Room for Rent",
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/browse" className="text-sm text-muted hover:text-garnet mb-6 inline-block">
          ← Back to listings
        </Link>

        <div className="rounded-radius-2xl border border-border overflow-hidden bg-white shadow-premium">
          <div className="aspect-[16/9] relative overflow-hidden">
            <Image
              src={listing.coverImageUrl || siteSettings.listingFallbackImage}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              quality={90}
              unoptimized={(listing.coverImageUrl || siteSettings.listingFallbackImage).startsWith("http")}
            />
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{listing.title}</h1>
                <p className="text-2xl font-bold text-garnet mt-1">{listing.priceDisplay}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded bg-garnet-muted text-garnet text-sm">
                  {typeLabels[listing.listingType] ?? listing.listingType}
                </span>
              </div>
            </div>
            <p className="text-muted mb-4">
              {listing.beds} bed · {listing.baths} bath
              {listing.availableDate && (
                <> · Available {new Date(listing.availableDate).toLocaleDateString()}</>
              )}
            </p>
            <p className="whitespace-pre-wrap text-foreground">{listing.description}</p>
            <p className="text-sm text-muted mt-4">
              Posted by {listing.host?.name ?? listing.host?.email ?? "FSU Student"}
            </p>

            <ListingActions
              listingId={listing.id}
              hostId={listing.hostId}
              canMessage={canMessage}
              eduVerified={eduVerified}
              currentUserId={user?.id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
