"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { staggerItem, staggerContainer } from "@/lib/motion"
import { ArrowRight } from "lucide-react"
import { siteContent } from "@/content/siteContent"

const DEFAULT_FALLBACK = "/images/listing-fallback.jpg"

export function LandingUrgentListings({
  listings,
  listingFallbackImage = DEFAULT_FALLBACK,
}: {
  listingFallbackImage?: string
  listings: Array<{
    id: string
    title: string
    priceDisplay: string
    coverImageUrl: string | null
    beds: number
    baths: number
    listingType: string
    host?: { name: string | null }
  }>
}) {
  if (listings.length === 0) return null

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="w-16 h-px bg-border mb-6" />
          <h2 className="text-section md:text-3xl font-bold text-foreground">
            {siteContent.urgentListings.title}
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {listings.map((listing) => (
            <motion.div key={listing.id} variants={staggerItem}>
              <Link href={`/listings/${listing.id}`}>
                <div className="rounded-radius-2xl border-2 border-gold/40 overflow-hidden bg-white shadow-premium hover:shadow-premiumHover hover:-translate-y-1 transition-all duration-220 group">
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    <Image
                      src={listing.coverImageUrl || listingFallbackImage}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-220"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      quality={90}
                      unoptimized={(listing.coverImageUrl || listingFallbackImage).startsWith("http")}
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent"
                      aria-hidden
                    />
                    <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold text-garnet text-xs font-semibold shadow-soft">
                      <span className="w-1.5 h-1.5 rounded-full bg-garnet animate-pulse" />
                      {siteContent.urgentListings.urgentBadge}
                    </span>
                    <span className="absolute top-4 right-4 px-2.5 py-1 rounded-md border border-garnet/50 text-garnet text-[11px] font-medium tracking-wide bg-white/90">
                      {siteContent.urgentListings.verifiedBadge}
                    </span>
                  </div>
                  <div className="p-5 md:p-6">
                    <p className="text-2xl font-bold text-garnet tabular-nums mb-2">
                      {listing.priceDisplay}
                    </p>
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2 text-[15px] leading-snug">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-muted mb-4">
                      {listing.beds} bed · {listing.baths} bath
                    </p>
                    <span className="flex items-center justify-center gap-2 w-full py-2.5 rounded-radius-xl bg-garnet-muted text-garnet text-sm font-medium hover:bg-garnet-muted/80 transition-colors group-hover:bg-garnet group-hover:text-white">
                      {siteContent.urgentListings.viewDetails}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
