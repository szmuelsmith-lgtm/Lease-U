"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { staggerContainer, staggerItem } from "@/lib/motion"
import { siteContent } from "@/content/siteContent"

export function MessagesClient({
  messages,
  currentUserId,
}: {
  messages: Array<{
    id: string
    body: string
    createdAt: Date
    listing?: { id: string; title: string }
    fromUser?: { id: string; name: string | null; email: string }
    toUser?: { id: string; name: string | null; email: string }
  }>
  currentUserId: string
}) {
  if (messages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24"
      >
        <div className="rounded-radius-2xl border border-border bg-white p-14 text-center max-w-md shadow-premium">
          <div className="w-20 h-20 rounded-radius-xl bg-cream flex items-center justify-center mx-auto mb-6 text-muted">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{siteContent.messages.emptyTitle}</h2>
          <p className="text-muted text-[15px] leading-[1.6] mb-8">
            {siteContent.messages.emptyDescription}
          </p>
          <Button asChild>
            <Link href="/browse">{siteContent.messages.emptyCTA}</Link>
          </Button>
        </div>
      </motion.div>
    )
  }

  const validMessages = messages.filter((m) => m.listing && m.fromUser && m.toUser)

  const grouped = validMessages.reduce((acc, m) => {
    const key = [m.listing!.id, m.fromUser!.id, m.toUser!.id].sort().join("-")
    if (!acc[key]) acc[key] = { listing: m.listing!, messages: [], otherUser: m.fromUser!.id === currentUserId ? m.toUser! : m.fromUser! }
    acc[key].messages.push(m)
    return acc
  }, {} as Record<string, { listing: { id: string; title: string }; messages: typeof validMessages; otherUser: { id: string; name: string | null; email: string } }>)

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{siteContent.messages.heading}</h1>
      <motion.div
        className="space-y-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {Object.entries(grouped).map(([key, { listing, messages: msgs, otherUser }]) => (
          <motion.div
            key={key}
            variants={staggerItem}
            className="rounded-radius-2xl border border-border bg-white p-6 hover:shadow-premium hover:-translate-y-0.5 transition-all duration-220"
          >
            <Link href={`/listings/${listing.id}`}>
              <h3 className="font-semibold text-foreground">{listing.title}</h3>
              <p className="text-sm text-muted mt-1">
                {otherUser.name ?? otherUser.email} · {msgs.length} message{msgs.length !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-muted mt-1 line-clamp-1">{msgs[0].body}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
