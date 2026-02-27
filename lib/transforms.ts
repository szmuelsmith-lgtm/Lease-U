// Snake-case Supabase rows → camelCase props expected by existing UI components.
// This avoids touching any client component interfaces.

export type DbListing = {
  id: string
  university_slug: string
  title: string
  location_city: string
  location_state: string
  price_display: string
  price_cents: number
  cover_image_url: string | null
  beds: number
  baths: number
  listing_type: string
  description: string
  available_date: string | null
  verified_student_only: boolean
  status: string
  urgent: boolean
  featured: boolean
  host_id: string
  created_at: string
  host?: DbProfile
}

export type DbProfile = {
  id: string
  role: string
  email: string
  email_verified: boolean
  edu_verified: boolean
  created_at: string
  name?: string | null
}

export type DbMessage = {
  id: string
  listing_id: string
  from_user_id: string
  to_user_id: string
  body: string
  created_at: string
  listing?: { id: string; title: string }
  from_user?: DbProfile
  to_user?: DbProfile
}

export type DbReport = {
  id: string
  reporter_id: string
  listing_id: string
  reason: string | null
  details: string | null
  created_at: string
  listing?: DbListing
  reporter?: DbProfile
}

export function transformListing(row: DbListing) {
  return {
    id: row.id,
    universitySlug: row.university_slug,
    title: row.title,
    locationCity: row.location_city,
    locationState: row.location_state,
    priceDisplay: row.price_display,
    priceCents: row.price_cents,
    coverImageUrl: row.cover_image_url,
    beds: row.beds,
    baths: row.baths,
    listingType: row.listing_type,
    description: row.description,
    availableDate: row.available_date,
    verifiedStudentOnly: row.verified_student_only,
    status: row.status,
    urgent: row.urgent,
    featured: row.featured,
    hostId: row.host_id,
    createdAt: row.created_at,
    host: row.host
      ? { id: row.host.id, name: row.host.email?.split("@")[0] ?? null, email: row.host.email }
      : undefined,
  }
}

export function transformProfile(row: DbProfile) {
  return {
    id: row.id,
    role: row.role.toUpperCase(),
    email: row.email,
    name: row.name ?? row.email.split("@")[0],
    emailVerified: row.email_verified,
    eduVerified: row.edu_verified,
    createdAt: row.created_at,
  }
}

export function transformMessage(row: DbMessage) {
  return {
    id: row.id,
    listingId: row.listing_id,
    fromUserId: row.from_user_id,
    toUserId: row.to_user_id,
    body: row.body,
    createdAt: new Date(row.created_at),
    listing: row.listing ? { id: row.listing.id, title: row.listing.title } : undefined,
    fromUser: row.from_user
      ? { id: row.from_user.id, name: row.from_user.email?.split("@")[0] ?? null, email: row.from_user.email }
      : undefined,
    toUser: row.to_user
      ? { id: row.to_user.id, name: row.to_user.email?.split("@")[0] ?? null, email: row.to_user.email }
      : undefined,
  }
}

export function transformReport(row: DbReport) {
  return {
    id: row.id,
    reason: row.reason,
    details: row.details,
    createdAt: new Date(row.created_at),
    listing: row.listing ? transformListing(row.listing) : undefined,
    user: row.reporter ? { email: row.reporter.email } : { email: "" },
  }
}
