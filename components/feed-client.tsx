"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ListingCard } from "@/components/listing-card"
import { AuthGateLink } from "@/components/auth-gate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface FeedClientProps {
  listings: Array<{
    id: string
    title: string
    rent: number
    rentDisplay: string
    bedrooms: number
    bathrooms: number
    area: string
    moveInDate: string
    featured: boolean
    user: { name: string | null; email: string }
  }>
}

export function FeedClient({ listings }: FeedClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleFilterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const params = new URLSearchParams()
    const min = (form.elements.namedItem("min") as HTMLInputElement)?.value
    const max = (form.elements.namedItem("max") as HTMLInputElement)?.value
    const beds = (form.elements.namedItem("beds") as HTMLInputElement)?.value
    const featured = (form.elements.namedItem("featured") as HTMLInputElement)?.checked
    if (min) params.set("min", min)
    if (max) params.set("max", max)
    if (beds) params.set("beds", beds)
    if (featured) params.set("featured", "true")
    router.push(`/feed?${params.toString()}`)
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-gradient-to-br from-garnet/10 via-gold/10 to-garnet/5 border border-garnet/20 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Campus Housing <span className="text-garnet">@ Florida State</span>
            </h1>
            <p className="text-muted mt-1">
              Sublets, lease takeovers, and rooms — verified by FSU email.
            </p>
          </div>
          <AuthGateLink href="/listings/new">Post a listing</AuthGateLink>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Browse listings</h2>
        <form onSubmit={handleFilterSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <Label className="text-xs">Min rent ($)</Label>
          <Input
            name="min"
            type="number"
            placeholder="0"
            defaultValue={searchParams.get("min") ?? ""}
          />
        </div>
        <div>
          <Label className="text-xs">Max rent ($)</Label>
          <Input
            name="max"
            type="number"
            placeholder="Any"
            defaultValue={searchParams.get("max") ?? ""}
          />
        </div>
        <div>
          <Label className="text-xs">Min bedrooms</Label>
          <Input
            name="beds"
            type="number"
            placeholder="Any"
            defaultValue={searchParams.get("beds") ?? ""}
          />
        </div>
        <div className="flex items-end gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={searchParams.get("featured") === "true"}
            />
            <span className="text-sm">Featured only</span>
          </label>
        </div>
        <div className="flex items-end">
          <Button type="submit" className="bg-garnet hover:bg-garnet/90">Apply filters</Button>
        </div>
      </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-12 text-muted">
          No listings found.{" "}
          <AuthGateLink href="/listings/new" variant="link">Create one</AuthGateLink>
        </div>
      )}
    </div>
  )
}
