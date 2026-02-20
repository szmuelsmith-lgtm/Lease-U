"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Listing } from "@prisma/client"

interface EditListingFormProps {
  listing: Listing
}

export function EditListingForm({ listing }: EditListingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: listing.title,
    locationCity: listing.locationCity,
    locationState: listing.locationState,
    priceDisplay: listing.priceDisplay,
    beds: listing.beds.toString(),
    baths: listing.baths.toString(),
    availableDate: new Date(listing.availableDate).toISOString().split("T")[0],
    coverImageUrl: listing.coverImageUrl,
    description: listing.description,
    verifiedStudentOnly: listing.verifiedStudentOnly,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error("Failed to update listing")
      }

      router.push("/host/dashboard")
    } catch (error) {
      alert("Failed to update listing")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.locationCity}
                onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.locationState}
                onChange={(e) => setFormData({ ...formData, locationState: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="price">Monthly Rent</Label>
            <Input
              id="price"
              value={formData.priceDisplay}
              onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="beds">Bedrooms</Label>
              <Input
                id="beds"
                type="number"
                min="1"
                value={formData.beds}
                onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="baths">Bathrooms</Label>
              <Input
                id="baths"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.baths}
                onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="availableDate">Available Date</Label>
            <Input
              id="availableDate"
              type="date"
              value={formData.availableDate}
              onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="coverImageUrl">Cover Image URL</Label>
            <Input
              id="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full min-h-[200px] rounded-lg border border-border-soft p-3"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="verifiedStudentOnly"
              checked={formData.verifiedStudentOnly}
              onChange={(e) => setFormData({ ...formData, verifiedStudentOnly: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="verifiedStudentOnly">
              Verified students only (.edu email required)
            </Label>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
