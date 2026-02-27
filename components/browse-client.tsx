"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, ArrowRight } from "lucide-react"
import { siteContent } from "@/content/siteContent"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { staggerContainer, staggerItem } from "@/lib/motion"

const DEFAULT_FALLBACK = "/images/listing-fallback.jpg"

export function BrowseClient({
  listings,
  searchParams,
  listingFallbackImage = DEFAULT_FALLBACK,
}: {
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
  searchParams: { q?: string; min?: string; max?: string; beds?: string; type?: string }
  listingFallbackImage?: string
}) {
  const router = useRouter()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [min, setMin] = useState(searchParams.min ?? "")
  const [max, setMax] = useState(searchParams.max ?? "")
  const [beds, setBeds] = useState(searchParams.beds ?? "")
  const [type, setType] = useState(searchParams.type ?? "")
  const [q, setQ] = useState(searchParams.q ?? "")

  function applyFilters() {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (min) params.set("min", min)
    if (max) params.set("max", max)
    if (beds) params.set("beds", beds)
    if (type) params.set("type", type)
    router.push(`/browse?${params.toString()}`)
    setFiltersOpen(false)
  }

  const filterCount = [min, max, beds, type].filter(Boolean).length

  const typeLabels = siteContent.browse.typeLabels

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1 flex gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <Input
                placeholder={siteContent.browse.searchPlaceholder}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="pl-12 h-12 rounded-radius-xl border-border bg-white shadow-soft focus:shadow-premium transition-shadow"
              />
            </div>
            <Button onClick={() => applyFilters()} className="h-12 px-6">
              {siteContent.browse.searchButton}
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(true)}
            className="rounded-radius-xl px-5 h-12 shadow-soft relative"
          >
            {siteContent.browse.filtersButton}
            {filterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-garnet text-white text-xs font-bold flex items-center justify-center">
                {filterCount}
              </span>
            )}
          </Button>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {listings.map((listing) => (
            <motion.div key={listing.id} variants={staggerItem}>
              <Link href={`/listings/${listing.id}`}>
                <div className="rounded-radius-2xl border border-border overflow-hidden bg-white shadow-premium hover:shadow-premiumHover hover:-translate-y-1 transition-all duration-220 group">
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    {listing.coverImageUrl ? (
                      <Image
                        src={listing.coverImageUrl}
                        alt={listing.title}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-220"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={90}
                        unoptimized={listing.coverImageUrl.startsWith("http")}
                      />
                    ) : (
                      <Image
                        src={listingFallbackImage}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={90}
                        unoptimized={listingFallbackImage.startsWith("http")}
                      />
                    )}
                    <div
                      className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent"
                      aria-hidden
                    />
                    <span className="absolute top-4 right-4 px-2.5 py-1 rounded-md border border-garnet/50 text-garnet text-[11px] font-medium tracking-wide bg-white/90">
                      {siteContent.browse.verifiedBadge}
                    </span>
                  </div>
                  <div className="p-5 md:p-6">
                    <p className="text-xl font-bold text-garnet mb-1 tabular-nums">
                      {listing.priceDisplay}
                    </p>
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2 text-[15px] leading-snug">
                      {listing.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-garnet-muted text-garnet text-xs font-medium">
                        {typeLabels[listing.listingType] ?? listing.listingType}
                      </span>
                    </div>
                    <p className="text-sm text-muted mb-4">
                      {listing.beds} bed · {listing.baths} bath · {listing.host?.name ?? siteContent.browse.defaultHostName}
                    </p>
                    <span className="flex items-center justify-center gap-2 w-full py-2.5 rounded-radius-xl border border-garnet text-garnet text-sm font-medium hover:bg-garnet hover:text-white transition-colors">
                      {siteContent.browse.viewDetails}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {listings.length === 0 && (
          <div className="text-center py-20 text-muted">
            {siteContent.browse.emptyState} <Link href="/post" className="text-garnet hover:underline font-medium">{siteContent.browse.emptyStateCTA}</Link>
          </div>
        )}
      </div>

      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{siteContent.browse.filtersTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{siteContent.browse.priceRangeLabel}</label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">{siteContent.browse.minBedroomsLabel}</label>
              <Input
                type="number"
                min={0}
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{siteContent.browse.listingTypeLabel}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-10 rounded-radius-xl border border-border px-3 mt-1"
              >
                {siteContent.browse.typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <Button onClick={applyFilters} className="w-full">{siteContent.browse.applyButton}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
