import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  locationCity: z.string().min(1).optional(),
  locationState: z.string().min(1).optional(),
  priceDisplay: z.string().min(1).optional(),
  beds: z.number().int().positive().optional(),
  baths: z.number().positive().optional(),
  availableDate: z.string().optional(),
  coverImageUrl: z.string().optional(),
  description: z.string().min(1).optional(),
  verifiedStudentOnly: z.boolean().optional(),
  status: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED", "REMOVED"]).optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    if (listing.hostId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const data = updateSchema.parse(body)

    const updateData: any = { ...data }
    if (data.beds !== undefined) updateData.beds = data.beds
    if (data.baths !== undefined) updateData.baths = data.baths
    if (data.availableDate) {
      updateData.availableDate = new Date(data.availableDate)
    }

    const updated = await prisma.listing.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ success: true, listing: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
