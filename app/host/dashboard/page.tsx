import { Nav } from "@/components/nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline",
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
  REMOVED: "destructive",
}

export default async function HostDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== "HOST" && session.user.role !== "ADMIN")) {
    redirect("/login")
  }

  const listings = await prisma.listing.findMany({
    where: { hostId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-bg_right">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">My Listings</h1>
            <p className="text-text-muted">Manage your property listings</p>
          </div>
          <Button asChild>
            <Link href="/host/new">
              <Plus className="h-4 w-4 mr-2" />
              Post New Listing
            </Link>
          </Button>
        </div>

        <div className="grid gap-4">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{listing.title}</h3>
                      <Badge variant={statusColors[listing.status]}>
                        {listing.status}
                      </Badge>
                    </div>
                    <p className="text-text-muted mb-2">
                      {listing.locationCity}, {listing.locationState} · {listing.priceDisplay}
                    </p>
                    <p className="text-sm text-text-muted">
                      Created {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/listing/${listing.id}`}>View</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/host/listings/${listing.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {listings.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-text-muted mb-4">You haven't posted any listings yet.</p>
                <Button asChild>
                  <Link href="/host/new">Post Your First Listing</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
