import { createClient } from "@/lib/supabase/server"
import { getSiteSettings } from "@/lib/site-settings"
import { transformListing } from "@/lib/transforms"
import { Nav } from "@/components/nav"
import { LandingHero } from "@/components/landing/hero"
import { LandingStats } from "@/components/landing/stats"
import { LandingHowItWorks } from "@/components/landing/how-it-works"
import { LandingUrgentListings } from "@/components/landing/urgent-listings"
import { LandingFeaturedListings } from "@/components/landing/featured-listings"
import { LandingBuiltForStudents } from "@/components/landing/built-for-students"
import { LandingCta } from "@/components/landing/cta"

export default async function HomePage() {
  const supabase = createClient()

  const [urgentRes, featuredRes, siteSettings] = await Promise.all([
    supabase
      .from("listings")
      .select("*, host:profiles!host_id(id, email)")
      .eq("status", "approved")
      .eq("urgent", true)
      .limit(4),
    supabase
      .from("listings")
      .select("*, host:profiles!host_id(id, email)")
      .eq("status", "approved")
      .eq("featured", true)
      .limit(6),
    getSiteSettings(),
  ])

  const urgentListings = (urgentRes.data ?? []).map(transformListing)
  const featuredListings = (featuredRes.data ?? []).map(transformListing)

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <LandingHero heroImage={siteSettings.heroImage} />
      <LandingStats />
      <LandingHowItWorks />
      <LandingUrgentListings listings={urgentListings} listingFallbackImage={siteSettings.listingFallbackImage} />
      <LandingFeaturedListings listings={featuredListings} listingFallbackImage={siteSettings.listingFallbackImage} />
      <LandingBuiltForStudents builtForStudentsImage={siteSettings.builtForStudentsImage} />
      <LandingCta />
    </div>
  )
}
