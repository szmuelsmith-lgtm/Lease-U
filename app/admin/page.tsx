import { Nav } from "@/components/nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ApproveActions } from "@/components/approve-actions"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const pending = await prisma.listing.findMany({
    where: { status: "PENDING" },
    include: { host: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  const approved = await prisma.listing.findMany({
    where: { status: "APPROVED" },
    include: { host: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  const removed = await prisma.listing.findMany({
    where: { status: "REMOVED" },
    include: { host: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return (
    <div className="min-h-screen bg-bg_right">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Admin Dashboard</h1>
        <p className="text-text-muted mb-8">Moderate listings and manage the platform</p>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approved.length})
            </TabsTrigger>
            <TabsTrigger value="removed">
              Removed ({removed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pending.map((listing) => (
              <Card key={listing.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{listing.title}</h3>
                        <Badge variant="secondary">PENDING</Badge>
                      </div>
                      <p className="text-text-muted mb-2">
                        {listing.locationCity}, {listing.locationState} · {listing.priceDisplay}
                      </p>
                      <p className="text-sm text-text-muted">
                        Posted by {listing.host.name || listing.host.email} ·{" "}
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <ApproveActions listingId={listing.id} />
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/listing/${listing.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pending.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center text-text-muted">
                  No pending listings
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {approved.map((listing) => (
              <Card key={listing.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{listing.title}</h3>
                        <Badge variant="default">APPROVED</Badge>
                      </div>
                      <p className="text-text-muted mb-2">
                        {listing.locationCity}, {listing.locationState} · {listing.priceDisplay}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm" asChild>
                        <Link href={`/api/admin/listings/${listing.id}/remove`}>Remove</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/listing/${listing.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {approved.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center text-text-muted">
                  No approved listings
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="removed" className="space-y-4">
            {removed.map((listing) => (
              <Card key={listing.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{listing.title}</h3>
                        <Badge variant="destructive">REMOVED</Badge>
                      </div>
                      <p className="text-text-muted mb-2">
                        {listing.locationCity}, {listing.locationState} · {listing.priceDisplay}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/listing/${listing.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {removed.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center text-text-muted">
                  No removed listings
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
