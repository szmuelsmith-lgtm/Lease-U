"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { transitionBase } from "@/lib/motion"
import { siteContent } from "@/content/siteContent"

export function LandingCta() {
  return (
    <section className="py-20 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transitionBase}
        className="rounded-radius-2xl bg-gradient-to-r from-garnet via-garnet to-garnetDark p-12 md:p-20 text-center relative overflow-hidden shadow-premium"
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 80% 20%, rgba(201,162,39,0.5) 0%, transparent 50%)",
          }}
        />
        <div className="relative">
          <h2 className="text-section md:text-3xl font-bold text-white mb-4">
            {siteContent.cta.title}
          </h2>
          <p className="text-white/90 mb-10 max-w-xl mx-auto text-base leading-[1.6]">
            {siteContent.cta.description}
          </p>
          <Button
            variant="accent"
            size="lg"
            className="bg-gold text-garnet hover:bg-gold/90 hover:-translate-y-px active:scale-[0.98] transition-all duration-220 shadow-premium"
            asChild
          >
            <Link href="/browse">{siteContent.cta.button}</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
