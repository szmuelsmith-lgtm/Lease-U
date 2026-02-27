"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getErrorMessage } from "@/lib/errors"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function NewListingForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const moveInDate = formData.get("moveInDate") as string
    const moveInDateTime = moveInDate ? new Date(moveInDate + "T12:00:00Z").toISOString() : new Date().toISOString()

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        rent: Math.round(parseFloat(formData.get("rent") as string) * 100),
        bedrooms: parseInt(formData.get("bedrooms") as string) || 0,
        bathrooms: parseFloat(formData.get("bathrooms") as string) || 0,
        area: formData.get("area"),
        moveInDate: moveInDateTime,
        durationMonths: parseInt(formData.get("durationMonths") as string) || undefined,
        description: formData.get("description"),
        photos: [],
        contactPreference: (formData.get("contactPreference") as string) || "email",
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(getErrorMessage(data.error))
      return
    }

    router.push(`/listings/${data.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required placeholder="e.g. 2BR near campus" />
      </div>
      <div>
        <Label htmlFor="rent">Rent ($/month)</Label>
        <Input id="rent" name="rent" type="number" min="1" step="0.01" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" name="bedrooms" type="number" min="0" defaultValue="0" />
        </div>
        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input id="bathrooms" name="bathrooms" type="number" min="0" step="0.5" defaultValue="1" />
        </div>
      </div>
      <div>
        <Label htmlFor="area">Area / Neighborhood / Complex</Label>
        <Input id="area" name="area" required placeholder="e.g. CollegeTown, The Renegade" />
      </div>
      <div>
        <Label htmlFor="moveInDate">Move-in date</Label>
        <Input id="moveInDate" name="moveInDate" type="date" required />
      </div>
      <div>
        <Label htmlFor="durationMonths">Lease duration (months, optional)</Label>
        <Input id="durationMonths" name="durationMonths" type="number" min="1" placeholder="12" />
      </div>
      <div>
        <Label htmlFor="contactPreference">Contact preference</Label>
        <select
          id="contactPreference"
          name="contactPreference"
          className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2"
        >
          <option value="platform_message">Platform message</option>
          <option value="both">Both</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          placeholder="Describe the place, amenities, etc."
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Creating…" : "Create listing"}
      </Button>
    </form>
  )
}
