import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const reportSchema = z.object({
  listingId: z.string().uuid(),
  reason: z.string().min(1).max(1000),
  details: z.string().max(5000).optional(),
})

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = reportSchema.parse(body)

    const { error } = await supabase.from("reports").insert({
      reporter_id: user.id,
      listing_id: data.listingId,
      reason: data.reason,
      details: data.details ?? null,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (e.name === "ZodError") {
      const { formatZodErrors } = await import("@/lib/errors")
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
