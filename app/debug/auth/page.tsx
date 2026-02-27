"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type DebugState = {
  env: { urlSet: boolean; anonKeySet: boolean } | null
  session: { loggedIn: boolean; email?: string; id?: string } | null
  profile: Record<string, unknown> | null
  profileError: string | null
  testResult: string | null
}

export default function DebugAuthPage() {
  const [state, setState] = useState<DebugState>({
    env: null,
    session: null,
    profile: null,
    profileError: null,
    testResult: null,
  })
  const [testEmail, setTestEmail] = useState("admin@leaseu.app")
  const [testPassword, setTestPassword] = useState("Admin123!")
  const [testing, setTesting] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return

    setState((s) => ({
      ...s,
      env: {
        urlSet: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKeySet: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    }))

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()

      const sessionInfo = user
        ? { loggedIn: true, email: user.email, id: user.id }
        : { loggedIn: false }

      let profile = null
      let profileError = null
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        profile = data
        profileError = error?.message ?? null
      }

      setState((s) => ({ ...s, session: sessionInfo, profile, profileError }))
    }
    load()
  }, [supabase])

  async function runSignInTest() {
    setTesting(true)
    setState((s) => ({ ...s, testResult: null }))

    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })

    if (error) {
      setState((s) => ({
        ...s,
        testResult: `FAIL: ${error.message} (status: ${error.status})`,
      }))
    } else {
      setState((s) => ({
        ...s,
        testResult: `SUCCESS: Signed in as ${data.user?.email} (id: ${data.user?.id})`,
        session: {
          loggedIn: true,
          email: data.user?.email,
          id: data.user?.id,
        },
      }))
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user!.id)
        .single()
      setState((s) => ({
        ...s,
        profile,
        profileError: profileErr?.message ?? null,
      }))
    }
    setTesting(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setState((s) => ({
      ...s,
      session: { loggedIn: false },
      profile: null,
      profileError: null,
      testResult: "Signed out.",
    }))
  }

  if (process.env.NODE_ENV === "production") {
    return <p>Not available in production.</p>
  }

  return (
    <div className="max-w-2xl mx-auto p-8 font-mono text-sm">
      <h1 className="text-xl font-bold mb-6">Debug: Auth Health Check</h1>

      <Section title="1. Environment Variables">
        <Pre data={state.env} />
      </Section>

      <Section title="2. Current Session">
        <Pre data={state.session} />
        {state.session?.loggedIn && (
          <Button size="sm" variant="outline" className="mt-2" onClick={handleSignOut}>
            Sign out
          </Button>
        )}
      </Section>

      <Section title="3. Profile Row (from public.profiles)">
        {state.profileError ? (
          <p className="text-red-600">Error: {state.profileError}</p>
        ) : state.profile ? (
          <Pre data={state.profile} />
        ) : (
          <p className="text-muted">No profile (not logged in or row missing)</p>
        )}
      </Section>

      <Section title="4. Sign-In Test">
        <div className="flex gap-2 mb-2">
          <Input
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="email"
            className="font-mono text-xs"
          />
          <Input
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
            placeholder="password"
            type="password"
            className="font-mono text-xs"
          />
          <Button size="sm" onClick={runSignInTest} disabled={testing}>
            {testing ? "..." : "Test"}
          </Button>
        </div>
        {state.testResult && (
          <p className={state.testResult.startsWith("SUCCESS") ? "text-green-600" : "text-red-600"}>
            {state.testResult}
          </p>
        )}
      </Section>

      <Section title="5. Quick Credentials">
        <pre className="text-xs bg-gray-100 p-3 rounded">{`admin@leaseu.app / Admin123!
student@fsu.edu / Student123!
viewer@gmail.com / Viewer123!`}</pre>
        <p className="text-xs text-muted mt-1">
          Run <code>npm run seed:users</code> first to create these accounts.
        </p>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 border border-gray-200 rounded-lg p-4">
      <h2 className="font-semibold text-sm mb-2">{title}</h2>
      {children}
    </div>
  )
}

function Pre({ data }: { data: unknown }) {
  return (
    <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
      {data ? JSON.stringify(data, null, 2) : "loading..."}
    </pre>
  )
}
