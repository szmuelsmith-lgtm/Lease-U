import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const updateSchema = z.object({
  heroImage: z.string().min(1).refine((v) => v.startsWith("/") || v.startsWith("http")).optional(),
  builtForStudentsImage: z.string().min(1).refine((v) => v.startsWith("/") || v.startsWith("http")).optional(),
  listingFallbackImage: z.string().min(1).refine((v) => v.startsWith("/") || v.startsWith("http")).optional(),
})

export async function PATCH(req: Request) {
  try {
    await requireAdmin()
    const supabase = createClient()
    const body = await req.json()
    const data = updateSchema.parse(body)

    for (const [key, value] of Object.entries(data)) {
      if (value == null) continue
      await supabase
        .from("site_settings")
        .upsert({ key, value }, { onConflict: "key" })
    }

    const { data: rows } = await supabase.from("site_settings").select("key, value")
    const settings: Record<string, string> = {}
    for (const r of rows ?? []) {
      settings[r.key] = r.value
    }
    return NextResponse.json(settings)
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
