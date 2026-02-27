/**
 * LeaseU Backend Functionality Verification Script
 *
 * Usage:
 *   npx tsx scripts/verify-backend.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * in .env at the project root.
 *
 * This script tests RLS policies and backend behavior against each
 * functional requirement (A1–F17). It uses the anon key for public
 * browsing tests and does NOT require authenticated sessions for
 * policy-shape verification (it checks policy definitions and
 * code-level enforcement).
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

const root = join(__dirname, "..")

function loadEnv() {
  const envPath = join(root, ".env")
  if (!existsSync(envPath)) {
    console.error("ERROR: .env not found at", envPath)
    process.exit(1)
  }
  const lines = readFileSync(envPath, "utf-8").split("\n")
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

type Result = { id: string; label: string; pass: boolean; note: string }
const results: Result[] = []

function record(id: string, label: string, pass: boolean, note = "") {
  results.push({ id, label, pass, note })
  const icon = pass ? "✅ PASS" : "❌ FAIL"
  console.log(`  ${icon}  ${id} — ${label}${note ? ` (${note})` : ""}`)
}

// ============================================================
// CODE-LEVEL CHECKS (read files and verify patterns)
// ============================================================

function fileContains(relPath: string, pattern: string | RegExp): boolean {
  const full = join(root, relPath)
  if (!existsSync(full)) return false
  const content = readFileSync(full, "utf-8")
  return typeof pattern === "string" ? content.includes(pattern) : pattern.test(content)
}

function fileExists(relPath: string): boolean {
  return existsSync(join(root, relPath))
}

// ============================================================
// TESTS
// ============================================================

async function run() {
  console.log("\n🔍 LeaseU Backend Verification\n")
  console.log("=".repeat(60))

  // ----------------------------------------------------------
  // A) PUBLIC BROWSING
  // ----------------------------------------------------------
  console.log("\n📖 A) PUBLIC BROWSING\n")

  // A1: Pages exist for landing, browse, listing detail
  const a1 =
    fileExists("app/page.tsx") &&
    fileExists("app/browse/page.tsx") &&
    fileExists("app/listings/[id]/page.tsx")
  record("A1", "Public pages exist (landing, browse, detail)", a1)

  // A2: Browse/landing queries filter status='approved'
  const browseFiltersApproved = fileContains("app/browse/page.tsx", '.eq("status", "approved")')
  const landingFiltersApproved = fileContains("app/page.tsx", '.eq("status", "approved")')
  record("A2", "Queries filter status='approved'", browseFiltersApproved && landingFiltersApproved)

  // A3: Anon select only returns approved (RLS test)
  // Also verify migration uses is_admin() to prevent infinite recursion
  const usesIsAdmin = fileContains("supabase/migration.sql", "public.is_admin()")
  const { data: anonListings, error: anonErr } = await supabase
    .from("listings")
    .select("id, status")
    .limit(50)

  if (anonErr) {
    const isRecursion = anonErr.message.includes("infinite recursion")
    record(
      "A3",
      "Anon can only see approved listings",
      false,
      isRecursion
        ? "Infinite recursion — re-run migration with is_admin() fix"
        : `Query error: ${anonErr.message}`
    )
  } else if (!anonListings || anonListings.length === 0) {
    record("A3", "Anon can only see approved listings", usesIsAdmin, usesIsAdmin ? "No listings (vacuously true); is_admin() present" : "is_admin() missing in migration")
  } else {
    const allApproved = anonListings.every((l) => l.status === "approved")
    record(
      "A3",
      "Anon can only see approved listings",
      allApproved,
      allApproved
        ? `${anonListings.length} rows, all approved`
        : `Found non-approved: ${anonListings.filter((l) => l.status !== "approved").map((l) => l.status).join(", ")}`
    )
  }

  // ----------------------------------------------------------
  // B) AUTH GATING
  // ----------------------------------------------------------
  console.log("\n🔐 B) AUTH GATING FOR MESSAGE + POST\n")

  // B4: Messages API checks auth + RLS requires edu_verified
  const b4_authCheck = fileContains("app/api/messages/route.ts", "if (!user)")
  const b4_rlsCheck = fileContains("supabase/migration.sql", "edu_verified = true")
  record("B4", "Messaging requires login + edu_verified (RLS)", b4_authCheck && b4_rlsCheck)

  // B5: Listing POST strips featured/urgent, forces pending
  const b5_noFeatured = !fileContains("app/api/listings/route.ts", "data.featured")
  const b5_forcesPending = fileContains("app/api/listings/route.ts", 'status: "pending"')
  const b5_forcesUrgentFalse = fileContains("app/api/listings/route.ts", "urgent: false")
  record(
    "B5",
    "POST /api/listings strips featured/urgent, forces pending",
    b5_noFeatured && b5_forcesPending && b5_forcesUrgentFalse,
    b5_noFeatured ? "" : "LEAK: data.featured still used"
  )

  // B6: HostGate explains restriction for non-FSU
  const b6 = fileContains("components/host-gate.tsx", "verified FSU students")
  record("B6", "Non-FSU users see restriction explanation", b6)

  // ----------------------------------------------------------
  // C) MESSAGE ROUTING
  // ----------------------------------------------------------
  console.log("\n💬 C) MESSAGE ROUTING\n")

  // C7: listing-actions sends toUserId=hostId; RLS enforces host_id = to_user_id
  const c7_client = fileContains("components/listing-actions.tsx", "toUserId: hostId")
  const c7_rls = fileContains("supabase/migration.sql", "host_id = to_user_id")
  record("C7", "Messages routed to listing host only", c7_client && c7_rls)

  // C8: Messages page filters by participant
  const c8 = fileContains("app/messages/page.tsx", "from_user_id") && fileContains("app/messages/page.tsx", "to_user_id")
  record("C8", "Only participants can read messages", c8)

  // C9: Error handling on message send failure
  const c9 = fileContains("components/listing-actions.tsx", "sendError") && fileContains("components/listing-actions.tsx", "Failed to send message")
  record("C9", "RLS failures surfaced as friendly UI errors", c9)

  // C7b: Anon cannot insert message (RLS test)
  const { error: anonMsgErr } = await supabase.from("messages").insert({
    listing_id: "00000000-0000-0000-0000-000000000000",
    from_user_id: "00000000-0000-0000-0000-000000000000",
    to_user_id: "00000000-0000-0000-0000-000000000000",
    body: "test",
  })
  record("C7b", "Anon cannot insert messages (RLS)", !!anonMsgErr, anonMsgErr?.code ?? "")

  // ----------------------------------------------------------
  // D) HOST LISTING EDIT RULES
  // ----------------------------------------------------------
  console.log("\n✏️  D) HOST LISTING EDIT RULES\n")

  // D10: Host update policy exists with frozen fields
  const d10 = fileContains(
    "supabase/migration.sql",
    "status   = (select l.status"
  )
  record("D10", "RLS freezes status/urgent/featured/host_id on host update", d10)

  // D11: No host edit API endpoint exists
  const d11 = !fileExists("app/api/listings/[id]/edit/route.ts")
  record("D11", "No host self-edit API (only admin PATCH)", d11)

  // D12: Anon cannot update listings (RLS)
  const { error: anonUpdateErr } = await supabase
    .from("listings")
    .update({ title: "hacked" })
    .eq("id", "00000000-0000-0000-0000-000000000000")
  record("D12", "Anon cannot update listings (RLS)", !!anonUpdateErr, anonUpdateErr?.code ?? "")

  // ----------------------------------------------------------
  // E) ADMIN MODERATION
  // ----------------------------------------------------------
  console.log("\n🛡️  E) ADMIN MODERATION\n")

  // E13: Admin page fetches pending listings
  const e13 = fileContains("app/admin/page.tsx", '.eq("status", "pending")')
  record("E13", "Admin page fetches pending listings", e13)

  // E14: Admin API allows approve/reject/remove
  const e14 =
    fileContains("app/api/admin/listings/[id]/route.ts", 'z.enum(["approve", "reject", "remove"])') &&
    fileContains("app/api/admin/listings/[id]/route.ts", '"approved"') &&
    fileContains("app/api/admin/listings/[id]/route.ts", '"rejected"') &&
    fileContains("app/api/admin/listings/[id]/route.ts", '"removed"')
  record("E14", "Admin API supports approve/reject/remove", e14)

  // E15: Admin client uses correct status casing
  const e15_correct = fileContains("components/admin-client.tsx", 'l.status === "approved"')
  const e15_broken = fileContains("components/admin-client.tsx", 'l.status === "APPROVED"')
  record("E15", "Admin Remove button uses correct status casing", e15_correct && !e15_broken)

  // ----------------------------------------------------------
  // F) PROFILE SECURITY
  // ----------------------------------------------------------
  console.log("\n🔒 F) PROFILE SECURITY\n")

  // F16: No user self-update policy
  const migrationContent = readFileSync(join(root, "supabase/migration.sql"), "utf-8")
  const hasUserUpdatePolicy = /create policy.*users can update own profile/i.test(migrationContent)
  record("F16", "No user self-update policy in RLS", !hasUserUpdatePolicy)

  // F17: Email confirmation trigger exists
  const f17 = fileContains("supabase/migration.sql", "handle_email_confirmation") &&
    fileContains("supabase/migration.sql", "on_auth_user_email_confirmed")
  record("F17", "Email confirmation trigger updates edu_verified", f17)

  // F16b: Anon cannot update profiles (RLS)
  const { error: anonProfileErr } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", "00000000-0000-0000-0000-000000000000")
  record("F16b", "Anon cannot update profiles (RLS)", !!anonProfileErr, anonProfileErr?.code ?? "")

  // ----------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------
  console.log("\n" + "=".repeat(60))
  const passed = results.filter((r) => r.pass).length
  const failed = results.filter((r) => !r.pass).length
  console.log(`\n📊 RESULTS: ${passed} passed, ${failed} failed out of ${results.length} checks\n`)

  if (failed > 0) {
    console.log("❌ FAILURES:")
    for (const r of results.filter((r) => !r.pass)) {
      console.log(`   ${r.id} — ${r.label}${r.note ? ` [${r.note}]` : ""}`)
    }
    console.log()
  }

  process.exit(failed > 0 ? 1 : 0)
}

run().catch((e) => {
  console.error("Script error:", e)
  process.exit(1)
})
