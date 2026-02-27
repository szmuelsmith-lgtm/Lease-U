"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Listing {
  id: string
  title: string
  rentDisplay: string
  status: string
  featured: boolean
  user: { email: string; name: string | null }
}

export function AdminListingsClient({
  listings,
  highlightId,
}: {
  listings: Listing[]
  highlightId?: string
}) {
  const router = useRouter()

  async function update(id: string, data: { status?: string; featured?: boolean }) {
    await fetch(`/api/admin/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    router.refresh()
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2">Title</th>
            <th className="text-left py-2">Rent</th>
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Featured</th>
            <th className="text-left py-2">User</th>
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((l) => (
            <tr
              key={l.id}
              className={`border-b border-border ${highlightId === l.id ? "bg-gold-muted" : ""}`}
            >
              <td className="py-2">
                <Link href={`/listings/${l.id}`} className="text-garnet hover:underline">
                  {l.title}
                </Link>
              </td>
              <td className="py-2">{l.rentDisplay}</td>
              <td className="py-2">{l.status}</td>
              <td className="py-2">{l.featured ? "Yes" : "No"}</td>
              <td className="py-2">{l.user.email}</td>
              <td className="py-2 flex gap-2">
                {l.status === "active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => update(l.id, { status: "removed" })}
                  >
                    Remove
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => update(l.id, { featured: !l.featured })}
                >
                  {l.featured ? "Unfeature" : "Feature"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
