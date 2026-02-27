"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { heroStagger } from "@/lib/motion"
import { siteContent } from "@/content/siteContent"

const DEFAULT_HERO = "/images/hero-campus.jpg"

export function LandingHero({ heroImage = DEFAULT_HERO }: { heroImage?: string }) {
  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt=""
          fill
          className="object-cover"
          priority
          quality={90}
          sizes="100vw"
          unoptimized={heroImage.startsWith("http")}
        />
        {/* 1) Light veil */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(248,249,252,0.84)" }}
        />
        {/* 2) Garnet vignette from edges */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(139,30,63,0.10) 100%)",
          }}
        />
        {/* 3) Gold highlight near CTA */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 20% 70%, rgba(201,162,39,0.12) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 md:px-8 py-24 md:py-32">
        <div className="max-w-[520px]">
          <motion.span
            {...heroStagger.badge}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/50 text-garnet text-xs font-semibold uppercase tracking-[0.15em] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-garnet" />
            {siteContent.hero.badge}
          </motion.span>

          <motion.h1
            {...heroStagger.headline}
            className="text-[2.4rem] md:text-[3.5rem] lg:text-[4rem] font-bold text-foreground leading-[1.05] tracking-tight mb-6"
          >
            {siteContent.hero.headlinePart1}
            <span className="font-serif text-gold relative">
              {siteContent.hero.headlineAccent}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-garnet/40 rounded" />
            </span>
          </motion.h1>

          <motion.p
            {...heroStagger.subtext}
            className="text-base md:text-lg text-muted max-w-[520px] leading-[1.6] mb-10"
          >
            {siteContent.hero.subheadline}
          </motion.p>

          <motion.div
            {...heroStagger.buttons}
            className="flex flex-wrap gap-4"
          >
            <Button
              size="lg"
              className="bg-garnet hover:bg-garnetDark text-white shadow-premium hover:shadow-premiumHover hover:-translate-y-px active:scale-[0.98] transition-all duration-220"
              asChild
            >
              <Link href="/browse">{siteContent.hero.primaryCTA}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-garnet bg-white/95 hover:bg-white shadow-soft hover:shadow-premium hover:-translate-y-px active:scale-[0.98] transition-all duration-220"
              asChild
            >
              <Link href="/post">{siteContent.hero.secondaryCTA}</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
