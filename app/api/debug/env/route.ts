import { NextResponse } from "next/server"

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

  return NextResponse.json({
    urlSet: url.length > 10,
    urlDomain: url ? new URL(url).hostname : "NOT SET",
    anonKeySet: anonKey.length > 20,
    anonKeyPrefix: anonKey.slice(0, 10) + "...",
    serviceRoleKeySet: serviceKey.length > 20,
    serviceRoleKeyPrefix: serviceKey.slice(0, 10) + "...",
    nodeEnv: process.env.NODE_ENV,
  })
}
