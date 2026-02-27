"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { easeOutCubic } from "@/lib/motion"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

const universities = [
  { name: "Florida State University", slug: "fsu", city: "Tallahassee" },
  { name: "University of Florida", slug: "uf", city: "Gainesville" },
  { name: "University of Central Florida", slug: "ucf", city: "Orlando" },
]

export function UniversitySearch() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const filtered = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(query.toLowerCase()) ||
      uni.city.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (query && filtered.length > 0) {
      setIsOpen(true)
    } else if (!query) {
      setIsOpen(false)
    }
  }, [query, filtered.length])

  const handleSelect = (slug: string) => {
    router.push(`/u/${slug}`)
    setIsOpen(false)
    setQuery("")
  }

  return (
    <div className="relative w-full max-w-md" ref={inputRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
        <Input
          type="text"
          placeholder="Select your university"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-12 pr-4"
        />
      </div>
      <AnimatePresence>
        {isOpen && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={{ duration: 0.28, ease: easeOutCubic }}
            className="absolute top-full mt-2 w-full bg-white border border-border rounded-xl shadow-card-premium z-50 overflow-hidden"
          >
            {filtered.map((uni, index) => (
              <button
                key={uni.slug}
                onClick={() => handleSelect(uni.slug)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={`w-full text-left px-4 py-3 hover:bg-garnet-muted transition-colors duration-200 ${
                  focusedIndex === index ? "bg-garnet-muted" : ""
                }`}
              >
                <div className="font-medium">{uni.name}</div>
                <div className="text-sm text-muted">{uni.city}</div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
