import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { formatZodErrors } from "@/lib/errors"

const createSchema = z.object({
  listingId: z.string().min(1),
  toUserId: z.string().min(1),
  body: z.string().min(1, "Message cannot be empty").max(2000),
})

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { listingId, toUserId, body: messageBody } = createSchema.parse(body)

    const { error } = await supabase.from("messages").insert({
      listing_id: listingId,
      from_user_id: user.id,
      to_user_id: toUserId,
      body: messageBody,
    })

    if (error) {
      if (error.code === "42501") {
        return NextResponse.json(
          { error: "Only verified FSU students can send messages on approved listings." },
          { status: 403 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
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
