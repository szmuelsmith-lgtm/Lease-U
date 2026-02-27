import { createClient } from "@/lib/supabase/server"

const DEFAULTS: Record<string, string> = {
  heroImage: "/images/hero-campus.jpg",
  builtForStudentsImage: "/images/housing-exterior.jpg",
  listingFallbackImage: "/images/listing-fallback.jpg",
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const out = { ...DEFAULTS }

  try {
    const supabase = createClient()
    const { data } = await supabase.from("site_settings").select("key, value")
    if (data) {
      for (const r of data) {
        out[r.key] = r.value
      }
    }
  } catch {
    // DB not ready or table missing — return defaults
  }

  return out
}
