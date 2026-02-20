"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import { Suspense } from "react"

function FiltersContent({ slug }: { slug: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentType = searchParams.get("type")
  const currentSearch = searchParams.get("search") || ""

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
    router.push(`/u/${slug}?${params.toString()}`)
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search by complex, address, or keyword..."
          className="flex-1"
          defaultValue={currentSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(e.currentTarget.value)
            }
          }}
        />
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <a href={`/u/${slug}`}>
          <Badge variant={!currentType ? "default" : "outline"}>
            All
          </Badge>
        </a>
        <a href={`/u/${slug}?type=sublet`}>
          <Badge variant={currentType === "sublet" ? "default" : "outline"}>
            Sublet
          </Badge>
        </a>
        <a href={`/u/${slug}?type=lease_takeover`}>
          <Badge variant={currentType === "lease_takeover" ? "default" : "outline"}>
            Lease Takeover
          </Badge>
        </a>
        <a href={`/u/${slug}?type=room`}>
          <Badge variant={currentType === "room" ? "default" : "outline"}>
            Room Rental
          </Badge>
        </a>
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
