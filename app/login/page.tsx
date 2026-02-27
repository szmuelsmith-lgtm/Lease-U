"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { siteContent } from "@/content/siteContent"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/browse"
  const registered = searchParams.get("registered") === "1"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setError("")
    setLoading(true)

    try {
      const supabase = createClient()

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        const msg = authError.message
        if (msg.includes("Invalid login credentials")) {
          setError(siteContent.auth.errorInvalidCredentials)
        } else if (msg.includes("Email not confirmed")) {
          setError(siteContent.auth.errorEmailNotConfirmed)
        } else if (msg.includes("rate")) {
          setError(siteContent.auth.errorRateLimit)
        } else {
          setError(msg)
        }
        return
      }
      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError(siteContent.auth.errorNetwork)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-16 max-w-md"
      >
        <h1 className="text-2xl font-bold text-foreground mb-6">{siteContent.auth.loginHeading}</h1>

        {registered && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm">
            {siteContent.auth.loginRegisteredBanner}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">{siteContent.auth.loginEmailLabel}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={siteContent.auth.loginEmailPlaceholder}
              required
              aria-invalid={!!error}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">{siteContent.auth.loginPasswordLabel}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={!!error}
              className="mt-1"
            />
          </div>
          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {siteContent.auth.loginLoading}
              </>
            ) : (
              siteContent.auth.loginButton
            )}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted text-center">
          {siteContent.auth.loginNoAccount}{" "}
          <Link href="/signup" className="text-garnet font-medium hover:underline">
            {siteContent.auth.loginSignUpLink}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
