import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const listingSchema = z.object({
  universitySlug: z.string(),
  listingType: z.enum(["SUBLET", "LEASE_TAKEOVER", "ROOM"]),
  title: z.string().min(1),
  locationCity: z.string().min(1),
  locationState: z.string().min(1),
  priceDisplay: z.string().min(1),
  beds: z.number().int().positive(),
  baths: z.number().positive(),
  availableDate: z.string(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().min(1),
  verifiedStudentOnly: z.boolean(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "HOST" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = listingSchema.parse({
      ...body,
      beds: parseInt(body.beds),
      baths: parseFloat(body.baths),
    })

    const listing = await prisma.listing.create({
      data: {
        ...data,
        coverImageUrl: data.coverImageUrl || "https://via.placeholder.com/800x600",
        availableDate: new Date(data.availableDate),
        hostId: session.user.id,
        status: "PENDING",
      },
    })

    return NextResponse.json({ success: true, listing })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
