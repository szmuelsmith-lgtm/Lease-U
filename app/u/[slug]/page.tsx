import { Nav } from "@/components/nav"
import { ListingCard } from "@/components/listing-card"
import { Filters } from "@/components/filters"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"

const universityMap: Record<string, { name: string; city: string }> = {
  fsu: { name: "Florida State University", city: "Tallahassee" },
  uf: { name: "University of Florida", city: "Gainesville" },
  ucf: { name: "University of Central Florida", city: "Orlando" },
}

export default async function UniversityFeed({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { type?: string; search?: string }
}) {
  const university = universityMap[params.slug]
  if (!university) notFound()

  const where: any = {
    universitySlug: params.slug,
    status: "APPROVED",
  }

  if (searchParams.type) {
    where.listingType = searchParams.type.toUpperCase()
  }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { locationCity: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
    ]
  }

  const listings = await prisma.listing.findMany({
    where,
    include: { host: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-bg_right">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Browse Listings</h1>
          <p className="text-text-muted">
            Find lease takeover and rooms near {university.name} campus.
          </p>
        </div>

        {/* Search and Filters */}
        <Filters slug={params.slug} />

        <div className="mb-4 text-text-muted">
          {listings.length} listing{listings.length !== 1 ? "s" : ""} found
        </div>

        {/* Listings Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {listings.map((listing, index) => (
            <ListingCard key={listing.id} listing={listing} index={index} />
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            No listings found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  )
}
