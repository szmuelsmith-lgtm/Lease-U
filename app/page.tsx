import { Nav } from "@/components/nav"
import { UniversitySearch } from "@/components/university-search"
import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import Link from "next/link"

export default async function Home() {
  const listings = await prisma.listing.findMany({
    where: { status: "APPROVED" },
    include: { host: { select: { name: true } } },
    take: 6,
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        {/* Split Hero Section */}
        <div className="grid lg:grid-cols-[42%_58%] gap-8 mb-16">
          {/* Left Hero Panel */}
          <div className="bg-bg_left rounded-lg p-8 lg:p-12 flex flex-col justify-center sticky top-8 h-fit">
            <div className="mb-6">
              <span className="inline-block bg-yellow-400 text-text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                Made for FSU Students
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-4">
              Subletting made{" "}
              <span className="text-accent">easy</span>
            </h1>
            <p className="text-text-muted mb-8 text-lg">
              The easiest way for FSU students to find lease takeovers, roommates, and housing near campus. Verified .edu emails only.
            </p>
            <div className="space-y-4 mb-6">
              <UniversitySearch />
              <div className="text-sm">
                <Link href="/host/new" className="text-accent hover:underline">
                  Have a property to list? Post your listing here →
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border-soft">
              <div>
                <div className="text-2xl font-bold">150+</div>
                <div className="text-sm text-text-muted">Active Listings</div>
              </div>
              <div>
                <div className="text-2xl font-bold">2,400+</div>
                <div className="text-sm text-text-muted">Students Connected</div>
              </div>
              <div>
                <div className="text-2xl font-bold">&lt; 2hrs</div>
                <div className="text-sm text-text-muted">Avg Response</div>
              </div>
              <div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-text-muted">FSU Verified</div>
              </div>
            </div>
          </div>

          {/* Right Listings Feed */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">Featured Listings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {listings.map((listing, index) => (
                <ListingCard key={listing.id} listing={listing} index={index} />
              ))}
            </div>
            {listings.length === 0 && (
              <div className="text-center py-12 text-text-muted">
                No listings yet. Be the first to post!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
