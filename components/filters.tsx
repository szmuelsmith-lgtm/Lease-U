"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Suspense, useState, useCallback, useEffect } from "react"
import Link from "next/link"

const typeFilters = [
  { value: "", label: "All" },
  { value: "sublet", label: "Sublet" },
  { value: "lease_takeover", label: "Lease takeover" },
  { value: "room", label: "Room rental" },
] as const

function FiltersContent({ slug }: { slug: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentType = searchParams.get("type") ?? ""
  const searchParam = searchParams.get("search") ?? ""
  const [searchInput, setSearchInput] = useState(searchParam)
  useEffect(() => {
    setSearchInput(searchParam)
  }, [searchParam])

  const applySearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set("search", value.trim())
      } else {
        params.delete("search")
      }
      router.push(`/u/${slug}?${params.toString()}`)
    },
    [slug, router, searchParams]
  )

  return (
    <div className="mb-8 space-y-5">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search by keyword, address, or complex..."
            className="pl-10 bg-surface_card border-border-soft"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applySearch(searchInput)
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => applySearch(searchInput)}
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors shrink-0"
        >
          Search
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {typeFilters.map(({ value, label }) => {
          const isActive = currentType === value
          const href = value ? `/u/${slug}?type=${value}` : `/u/${slug}`
          return (
            <Link
              key={value || "all"}
              href={href}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "bg-surface_card border border-border-soft text-text-primary hover:border-accent/40 hover:bg-accent-soft"
              }`}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function Filters({ slug }: { slug: string }) {
  return (
    <Suspense fallback={<div className="mb-8">Loading filters...</div>}>
      <FiltersContent slug={slug} />
    </Suspense>
  )
}
