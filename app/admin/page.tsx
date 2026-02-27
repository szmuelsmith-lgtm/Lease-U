import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { getSiteSettings } from "@/lib/site-settings"
import { transformListing, transformReport } from "@/lib/transforms"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AdminClient } from "@/components/admin-client"
import { Nav } from "@/components/nav"
import { siteContent } from "@/content/siteContent"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const session = await getSession()
  if (!session?.user) redirect("/login?callbackUrl=/admin")

  if (session.profile?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">{siteContent.admin.notAuthorizedTitle}</h1>
          <p className="text-muted mb-6">{siteContent.admin.notAuthorizedDescription}</p>
          <Link href="/browse" className="text-garnet font-medium hover:underline">
            {siteContent.admin.notAuthorizedLink}
          </Link>
        </div>
      </div>
    )
  }

  const supabase = createClient()

  const [pendingRes, approvedRes, removedRes, reportsRes, siteSettings] = await Promise.all([
    supabase
      .from("listings")
      .select("*, host:profiles!host_id(id, email)")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    supabase
      .from("listings")
      .select("*, host:profiles!host_id(id, email)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("listings")
      .select("*, host:profiles!host_id(id, email)")
      .eq("status", "removed")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("reports")
      .select("*, listing:listings(*, host:profiles!host_id(id, email)), reporter:profiles!reporter_id(id, email)")
      .order("created_at", { ascending: false }),
    getSiteSettings(),
  ])

  const pending = (pendingRes.data ?? []).map(transformListing)
  const approved = (approvedRes.data ?? []).map(transformListing)
  const removed = (removedRes.data ?? []).map(transformListing)
  const reports = (reportsRes.data ?? []).map(transformReport)

  return (
    <div className="min-h-screen bg-background">
      <AdminClient
        pending={pending}
        approved={approved}
        removed={removed}
        reports={reports}
        siteSettings={siteSettings}
      />
    </div>
  )
}
