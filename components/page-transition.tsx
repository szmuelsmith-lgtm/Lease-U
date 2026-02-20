"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayLocation, setDisplayLocation] = useState(pathname)

  useEffect(() => {
    if (pathname !== displayLocation) {
      setDisplayLocation(pathname)
    }
  }, [pathname, displayLocation])

  return (
    <motion.div
      key={displayLocation}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{
        duration: 0.3,
        ease: [0.2, 0.8, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
