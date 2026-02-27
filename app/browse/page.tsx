import { createClient } from "@/lib/supabase/server"
import { getSiteSettings } from "@/lib/site-settings"
import { transformListing } from "@/lib/transforms"
import { BrowseClient } from "@/components/browse-client"

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { q?: string; min?: string; max?: string; beds?: string; type?: string }
}) {
  const supabase = createClient()

  let query = supabase
    .from("listings")
    .select("*, host:profiles!host_id(id, email)")
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  if (searchParams.min) {
    query = query.gte("price_cents", parseInt(searchParams.min) * 100)
  }
  if (searchParams.max) {
    query = query.lte("price_cents", parseInt(searchParams.max) * 100)
  }
  if (searchParams.beds) {
    query = query.gte("beds", parseInt(searchParams.beds))
  }
  if (searchParams.type) {
    query = query.eq("listing_type", searchParams.type)
  }
  if (searchParams.q) {
    query = query.or(`title.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`)
  }

  const [listingsRes, siteSettings] = await Promise.all([query, getSiteSettings()])

  const listings = (listingsRes.data ?? []).map(transformListing)

  return (
    <div className="min-h-screen bg-background">
      <BrowseClient
        listings={listings}
        searchParams={searchParams}
        listingFallbackImage={siteSettings.listingFallbackImage}
      />
    </div>
  )
}
