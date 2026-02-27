import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { formatZodErrors } from "@/lib/errors"

const createSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  priceDisplay: z.string().min(1, "Price is required"),
  priceCents: z.coerce.number().int().positive("Price must be a positive number"),
  beds: z.coerce.number().int().min(0, "Beds must be 0 or more"),
  baths: z.coerce.number().min(0, "Baths must be 0 or more"),
  listingType: z.enum(["sublet", "lease_takeover", "room"], {
    errorMap: () => ({ message: "Select a listing type" }),
  }),
  description: z.string().min(1, "Description is required").max(5000),
  coverImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  availableDate: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = createSchema.parse(body)

    const { data: listing, error } = await supabase
      .from("listings")
      .insert({
        title: data.title,
        price_display: data.priceDisplay,
        price_cents: data.priceCents,
        beds: data.beds,
        baths: data.baths,
        listing_type: data.listingType,
        description: data.description,
        cover_image_url: data.coverImageUrl || null,
        available_date: data.availableDate || null,
        featured: false,
        urgent: false,
        status: "pending",
        host_id: user.id,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "42501") {
        return NextResponse.json(
          { error: "Only verified FSU student hosts can post." },
          { status: 403 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(listing)
  } catch (e: any) {
    if (e.name === "ZodError") {
      return NextResponse.json(
        { error: formatZodErrors(e.errors) },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: e.message ?? "Something went wrong" },
      { status: 500 }
    )
  }
}
