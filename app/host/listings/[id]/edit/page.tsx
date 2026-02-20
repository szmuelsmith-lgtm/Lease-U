import { Nav } from "@/components/nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { EditListingForm } from "@/components/edit-listing-form"

export default async function EditListingPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== "HOST" && session.user.role !== "ADMIN")) {
    redirect("/login")
  }

  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
  })

  if (!listing) notFound()

  if (listing.hostId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/host/dashboard")
  }

  return (
    <div className="min-h-screen bg-bg_right">
      <Nav />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-serif font-bold mb-8">Edit Listing</h1>
        <EditListingForm listing={listing} />
      </div>
    </div>
  )
}
