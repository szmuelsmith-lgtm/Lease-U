"use client"

import { motion } from "framer-motion"
import { staggerItem, staggerContainer } from "@/lib/motion"
import { siteContent } from "@/content/siteContent"

const stats = siteContent.stats

export function LandingStats() {
  return (
    <section className="border-y border-border bg-white py-20">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className={`flex flex-col items-center justify-center py-6 px-6 rounded-radius-xl bg-cream/50 border border-border shadow-soft ${
                i < 3 ? "md:border-r md:border-r-border" : ""
              }`}
            >
              <div className="text-2xl md:text-3xl font-bold text-garnet tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted mt-1.5 tracking-wide uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
