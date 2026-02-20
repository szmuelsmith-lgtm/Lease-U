"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Nav } from "@/components/nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthModal } from "@/components/auth-modal"
import { useSession } from "next-auth/react"
import { ChevronRight, ChevronLeft } from "lucide-react"

export default function NewListingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showAuth, setShowAuth] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    universitySlug: "fsu",
    listingType: "",
    title: "",
    locationCity: "",
    locationState: "FL",
    priceDisplay: "",
    beds: "",
    baths: "",
    availableDate: "",
    coverImageUrl: "",
    description: "",
    verifiedStudentOnly: false,
  })

  if (!session) {
    return (
      <div className="min-h-screen">
        <Nav />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <AuthModal open={true} onOpenChange={(open) => {
            if (!open) router.push("/")
          }} />
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error("Failed to create listing")
      }

      router.push("/host/dashboard")
    } catch (error) {
      alert("Failed to create listing")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg_right">
      <Nav />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-serif font-bold mb-2">Post a Listing</h1>
        <p className="text-text-muted mb-8">Help fellow students find their next home</p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-accent text-white" : "bg-bg_left text-text-muted"
            }`}
          >
            1
          </div>
          <div className="h-px w-16 bg-border-soft" />
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? "bg-accent text-white" : "bg-bg_left text-text-muted"
            }`}
          >
            2
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-lg font-semibold mb-4 block">
                    What type of listing?
                  </Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "LEASE_TAKEOVER", label: "Lease Replacement", desc: "I'm leaving my lease and need someone to take over" },
                      { value: "ROOM", label: "Room for Rent", desc: "I have available rooms in my place to fill" },
                      { value: "SUBLET", label: "Sublet", desc: "I'm subletting my place temporarily" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, listingType: type.value })}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          formData.listingType === type.value
                            ? "border-accent bg-accent-soft"
                            : "border-border-soft hover:border-accent"
                        }`}
                      >
                        <div className="font-semibold mb-1">{type.label}</div>
                        <div className="text-sm text-text-muted">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="university">University</Label>
                    <select
                      id="university"
                      value={formData.universitySlug}
                      onChange={(e) => setFormData({ ...formData, universitySlug: e.target.value })}
                      className="w-full h-10 rounded-lg border border-border-soft px-3"
                      required
                    >
                      <option value="fsu">Florida State University</option>
                      <option value="uf">University of Florida</option>
                      <option value="ucf">University of Central Florida</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Spacious 2BR near campus"
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
                        placeholder="Tallahassee"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.locationState}
                        onChange={(e) => setFormData({ ...formData, locationState: e.target.value })}
                        placeholder="FL"
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
                      placeholder="$750 /month"
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
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    if (formData.listingType) setStep(2)
                  }}
                  disabled={!formData.listingType}
                  className="w-full"
                >
                  Next Step <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="coverImageUrl">Cover Image URL</Label>
                  <Input
                    id="coverImageUrl"
                    value={formData.coverImageUrl}
                    onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full min-h-[200px] rounded-lg border border-border-soft p-3"
                    placeholder="Describe your listing..."
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Submitting..." : "Submit for Approval"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  )
}
