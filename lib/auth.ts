import { createClient } from "@/lib/supabase/server"
import { transformProfile } from "@/lib/transforms"

export async function getSession() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return {
    user,
    profile: profile ? transformProfile(profile) : null,
  }
}

export async function getCurrentProfile() {
  const session = await getSession()
  return session?.profile ?? null
}

export async function requireAuth() {
  const session = await getSession()
  if (!session?.user || !session.profile) throw new Error("Unauthorized")
  return { user: session.user, profile: session.profile }
}

export function assertFsuVerified(profile: { eduVerified: boolean; email: string }) {
  if (!profile.eduVerified) {
    throw new Error("Only verified @fsu.edu accounts can perform this action.")
  }
  if (!profile.email.toLowerCase().endsWith("@fsu.edu")) {
    throw new Error("Only @fsu.edu email addresses are allowed.")
  }
}

export async function requireHost() {
  const { user, profile } = await requireAuth()
  if (profile.role !== "HOST" && profile.role !== "ADMIN") {
    throw new Error("Host access required")
  }
  assertFsuVerified(profile)
  return { user, profile }
}

export async function requireAdmin() {
  const { profile } = await requireAuth()
  if (profile.role !== "ADMIN") throw new Error("Admin required")
  return profile
}
