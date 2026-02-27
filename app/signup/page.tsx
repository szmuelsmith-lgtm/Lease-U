"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { siteContent } from "@/content/siteContent"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setError("")

    if (password.length < 6) {
      setError(siteContent.auth.errorPasswordLength)
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const { error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name || email.split("@")[0] },
        },
      })

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError(siteContent.auth.errorAlreadyRegistered)
        } else if (authError.message.includes("rate")) {
          setError(siteContent.auth.errorRateLimit)
        } else {
          setError(authError.message)
        }
        return
      }
      router.push("/login?registered=1")
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
        <h1 className="text-2xl font-bold text-foreground mb-6">{siteContent.auth.signupHeading}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{siteContent.auth.signupNameLabel}</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={siteContent.auth.signupNamePlaceholder}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">{siteContent.auth.loginEmailLabel}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={siteContent.auth.signupEmailPlaceholder}
              required
              aria-invalid={!!error}
              className="mt-1"
            />
            <p className="text-xs text-muted mt-1">
              {siteContent.auth.signupEmailHint}
            </p>
          </div>
          <div>
            <Label htmlFor="password">{siteContent.auth.signupPasswordLabel}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
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
                {siteContent.auth.signupLoading}
              </>
            ) : (
              siteContent.auth.signupButton
            )}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted text-center">
          {siteContent.auth.signupHasAccount}{" "}
          <Link href="/login" className="text-garnet font-medium hover:underline">
            {siteContent.auth.signupLogInLink}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
