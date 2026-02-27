"use client"

import Link from "next/link"
import { useAuth } from "@/app/providers"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { transitionBase } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import { siteContent } from "@/content/siteContent"

const navLinks = siteContent.nav.links

export function Nav() {
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={transitionBase}
      className="sticky top-0 z-50 border-b border-border bg-cream/80 backdrop-blur-md shadow-nav"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-1 font-bold text-xl text-foreground">
            <span className="text-garnet">{siteContent.brand.name[0]}</span>
            <span className="text-gold">{siteContent.brand.name[1]}</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href
              return (
                <Link key={href} href={href}>
                  <span
                    className={`relative block px-5 py-2.5 rounded-radius-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-garnet bg-gold/30"
                        : "text-muted hover:text-foreground hover:bg-gold/10"
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {profile?.role === "ADMIN" && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin">{siteContent.nav.admin}</Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={signOut}>
                  {siteContent.nav.logOut}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">{siteContent.nav.logIn}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">{siteContent.nav.signUp}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
