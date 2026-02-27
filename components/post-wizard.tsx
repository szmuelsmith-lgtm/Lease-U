"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Repeat, Home, Search, Zap, ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import { transitionBase } from "@/lib/motion"
import { getErrorMessage } from "@/lib/errors"
import { siteContent } from "@/content/siteContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type ListingType = "lease_takeover" | "sublet" | "room"

type FormData = {
  title: string
  priceDisplay: string
  beds: string
  baths: string
  availableDate?: string
  description: string
  coverImageUrl?: string
}

const typeIcons: Record<string, typeof Repeat> = {
  lease_takeover: Repeat,
  sublet: Home,
  room: Search,
}

const types = siteContent.postListing.types.map((t) => ({
  ...t,
  icon: typeIcons[t.value] ?? Search,
}))

export function PostWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [listingType, setListingType] = useState<ListingType | null>(null)
  const [boostListing, setBoostListing] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<FormData>({
    defaultValues: {
      title: "",
      priceDisplay: "",
      beds: "0",
      baths: "1",
      description: "",
      coverImageUrl: "",
    },
    mode: "onSubmit",
  })

  function handleTypeSelect(type: ListingType) {
    setListingType(type)
    setStep(2)
  }

  async function handleSubmit(data: FormData) {
    if (!listingType) return
    setError("")
    setLoading(true)

    try {
      const priceMatch = data.priceDisplay.match(/\$?([\d,]+)/)
      const priceCents = priceMatch ? parseInt(priceMatch[1].replace(/,/g, "")) * 100 : 0

      if (priceCents <= 0) {
        setError(siteContent.postListing.errorInvalidPrice)
        setLoading(false)
        return
      }

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title.trim(),
          priceDisplay: data.priceDisplay.trim(),
          priceCents,
          beds: Number(data.beds) || 0,
          baths: Number(data.baths) || 1,
          listingType,
          description: data.description.trim(),
          coverImageUrl: data.coverImageUrl?.trim() || undefined,
          availableDate: data.availableDate
            ? new Date(data.availableDate).toISOString()
            : undefined,
          featured: boostListing,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(getErrorMessage(json.error))
        setLoading(false)
        return
      }
      setSubmitted(true)
      setTimeout(() => {
        router.push(`/listings/${json.id}`)
        router.refresh()
      }, 1200)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  const typeLabel = listingType
    ? types.find((t) => t.value === listingType)?.label ?? listingType
    : "—"

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
          {siteContent.postListing.heading}
        </h1>
        <p className="text-muted">
          {siteContent.postListing.subheading}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step >= s ? "bg-garnet text-white" : "bg-gray-200 text-muted"
              }`}
            >
              {step > s ? <CheckCircle className="h-4 w-4" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-0.5 ${step > s ? "bg-garnet" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Success State */}
        {submitted && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              {siteContent.postListing.successTitle}
            </h2>
            <p className="text-muted">
              {siteContent.postListing.successDescription}
            </p>
          </motion.div>
        )}

        {/* Step 1: Choose Type */}
        {step === 1 && !submitted && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={transitionBase}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-foreground text-center mb-6">
              What type of listing?
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {types.map((t) => {
                const Icon = t.icon
                const isSelected = listingType === t.value
                return (
                  <Card
                    key={t.value}
                    variant="interactive"
                    className={`p-6 cursor-pointer ${
                      isSelected ? "ring-2 ring-garnet" : ""
                    }`}
                    onClick={() => handleTypeSelect(t.value)}
                  >
                    <div className="text-center">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                          t.value === "room"
                            ? "bg-gold text-garnet"
                            : "bg-garnet text-white"
                        }`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">
                        {t.label}
                      </h3>
                      <p className="text-sm text-muted">{t.desc}</p>
                    </div>
                  </Card>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 2 && listingType && !submitted && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={transitionBase}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {listingType === "lease_takeover" && <Repeat className="h-5 w-5 text-garnet" />}
                  {listingType === "sublet" && <Home className="h-5 w-5 text-garnet" />}
                  {listingType === "room" && <Search className="h-5 w-5 text-garnet" />}
                  {siteContent.postListing.detailsCardTitle[listingType] ?? listingType}
                </CardTitle>
                <CardDescription>
                  {siteContent.postListing.detailsCardDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={form.handleSubmit(() => setStep(3))}
                  className="space-y-6"
                >
                  {false ? (
                    <>
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-garnet/10 text-garnet text-xs flex items-center justify-center">
                            1
                          </span>
                          Budget & Timeline
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="priceDisplay">Max Monthly Budget ($)</Label>
                            <Input
                              id="priceDisplay"
                              {...form.register("priceDisplay")}
                              placeholder="800"
                              className="mt-1 rounded-radius-xl"
                            />
                          </div>
                          <div>
                            <Label htmlFor="availableDate">Move-in Date</Label>
                            <Input
                              id="availableDate"
                              type="date"
                              {...form.register("availableDate")}
                              className="mt-1 rounded-radius-xl"
                            />
                          </div>
                          <div>
                            <Label htmlFor="beds">Beds Needed</Label>
                            <Input
                              id="beds"
                              type="number"
                              {...form.register("beds")}
                              placeholder="1"
                              className="mt-1 rounded-radius-xl"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-garnet/10 text-garnet text-xs flex items-center justify-center">
                            2
                          </span>
                          About You
                        </h4>
                        <div>
                          <Label htmlFor="title">Title (e.g. &quot;Looking for room near campus&quot;)</Label>
                          <Input
                            id="title"
                            {...form.register("title")}
                            placeholder="Looking for 1 bed near FSU"
                            className="mt-1 rounded-radius-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            {...form.register("description")}
                            placeholder="Tell potential roommates or landlords about yourself — your year, major, lifestyle, what you're looking for, etc."
                            rows={4}
                            className="mt-1"
                          />
                          {form.formState.errors.description && (
                            <p className="text-sm text-red-600 mt-1">
                              {form.formState.errors.description?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-garnet/10 text-garnet text-xs flex items-center justify-center">
                            1
                          </span>
                          {siteContent.postListing.sections.basicInfo}
                        </h4>
                        <div className="grid gap-4">
                          <div>
                            <Label htmlFor="title">{siteContent.postListing.labels.title}</Label>
                            <Input
                              id="title"
                              {...form.register("title")}
                              placeholder={siteContent.postListing.labels.titlePlaceholder}
                              className="mt-1 rounded-radius-xl"
                            />
                            {form.formState.errors.title && (
                              <p className="text-sm text-red-600 mt-1">
                                {form.formState.errors.title?.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="priceDisplay">{siteContent.postListing.labels.monthlyRent}</Label>
                            <Input
                              id="priceDisplay"
                              {...form.register("priceDisplay")}
                              placeholder={siteContent.postListing.labels.rentPlaceholder}
                              className="mt-1 rounded-radius-xl"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-garnet/10 text-garnet text-xs flex items-center justify-center">
                            2
                          </span>
                          {siteContent.postListing.sections.leaseInfo}
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="beds">{siteContent.postListing.labels.beds}</Label>
                            <Input
                              id="beds"
                              type="number"
                              {...form.register("beds")}
                              placeholder="2"
                              className="mt-1 rounded-radius-xl"
                            />
                          </div>
                          <div>
                            <Label htmlFor="baths">{siteContent.postListing.labels.baths}</Label>
                            <Input
                              id="baths"
                              type="number"
                              step={0.5}
                              {...form.register("baths")}
                              placeholder="2"
                              className="mt-1 rounded-radius-xl"
                            />
                          </div>
                          <div>
                            <Label htmlFor="availableDate">{siteContent.postListing.labels.availableDate}</Label>
                            <Input
                              id="availableDate"
                              type="date"
                              {...form.register("availableDate")}
                              className="mt-1 rounded-radius-xl"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-garnet/10 text-garnet text-xs flex items-center justify-center">
                            3
                          </span>
                          {siteContent.postListing.sections.descriptionAndImage}
                        </h4>
                        <div>
                          <Label htmlFor="description">{siteContent.postListing.labels.description}</Label>
                          <Textarea
                            id="description"
                            {...form.register("description")}
                            placeholder={siteContent.postListing.labels.descriptionPlaceholder}
                            rows={4}
                            className="mt-1"
                          />
                          {form.formState.errors.description && (
                            <p className="text-sm text-red-600 mt-1">
                              {form.formState.errors.description?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="coverImageUrl">{siteContent.postListing.labels.coverImageUrl}</Label>
                          <Input
                            id="coverImageUrl"
                            {...form.register("coverImageUrl")}
                            placeholder={siteContent.postListing.labels.coverImagePlaceholder}
                            className="mt-1 rounded-radius-xl"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      {siteContent.postListing.backButton}
                    </Button>
                    <Button type="submit" className="flex-1">
                      {siteContent.postListing.continueButton}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Boost & Submit */}
        {step === 3 && listingType && !submitted && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={transitionBase}
            className="space-y-6"
          >
            {/* Boost Option */}
            <Card variant={boostListing ? "boosted" : "default"}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-garnet" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{siteContent.postListing.boostTitle}</h3>
                        <p className="text-sm text-muted mt-1">
                          {siteContent.postListing.boostDescription}
                        </p>
                      </div>
                      <Switch
                        checked={boostListing}
                        onCheckedChange={setBoostListing}
                      />
                    </div>
                    <div className="flex gap-2 mt-4 flex-wrap">
                      <Badge variant="accent">{siteContent.postListing.boostBadges[0]}</Badge>
                      <Badge variant="secondary">{siteContent.postListing.boostBadges[1]}</Badge>
                      <Badge variant="secondary">{siteContent.postListing.boostBadges[2]}</Badge>
                    </div>
                    {boostListing && (
                      <div className="mt-4 p-3 bg-gold/20 rounded-lg">
                        <span className="text-sm font-semibold text-garnet">
                          {siteContent.postListing.boostPrice}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review & Submit */}
            <Card>
              <CardHeader>
                <CardTitle>{siteContent.postListing.reviewTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted">{siteContent.postListing.reviewLabels.type}</span>
                    <p className="font-medium">{typeLabel}</p>
                  </div>
                  <div>
                    <span className="text-muted">{siteContent.postListing.reviewLabels.title}</span>
                    <p className="font-medium line-clamp-1">
                      {form.watch("title") || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted">
                      {siteContent.postListing.reviewLabels.price}
                    </span>
                    <p className="font-medium">
                      {form.watch("priceDisplay")
                        ? `$${String(form.watch("priceDisplay")).replace(/\D/g, "")}/mo`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted">{siteContent.postListing.reviewLabels.bedsBaths}</span>
                    <p className="font-medium">
                      {form.watch("beds")} / {form.watch("baths")}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted">{siteContent.postListing.reviewLabels.boost}</span>
                    <p className="font-medium">{boostListing ? "Yes" : "No"}</p>
                  </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="flex gap-3 pt-4 border-t"
                >
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    {siteContent.postListing.backButton}
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {siteContent.postListing.submitLoading}
                      </>
                    ) : (
                      <>
                        {siteContent.postListing.submitButton}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
