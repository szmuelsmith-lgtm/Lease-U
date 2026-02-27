import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const schema = z.object({
  action: z.enum(["approve", "reject", "remove"]),
})

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    const supabase = createClient()
    const body = await req.json()
    const { action } = schema.parse(body)

    const status =
      action === "approve"
        ? "approved"
        : action === "reject"
        ? "rejected"
        : "removed"

    const { error } = await supabase
      .from("listings")
      .update({ status })
      .eq("id", params.id)

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
