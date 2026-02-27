"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { transitionBase } from "@/lib/motion"
import { siteContent } from "@/content/siteContent"

const features = siteContent.builtForStudents.features

const DEFAULT_HOUSING = "/images/housing-exterior.jpg"

export function LandingBuiltForStudents({ builtForStudentsImage = DEFAULT_HOUSING }: { builtForStudentsImage?: string }) {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={transitionBase}
          >
            <div className="w-16 h-px bg-border mb-6" />
            <h2 className="text-section md:text-3xl font-bold text-foreground mb-8">
              {siteContent.builtForStudents.title}
            </h2>
            <ul className="space-y-6">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-garnet flex items-center justify-center text-white text-sm font-bold shrink-0">
                    ✓
                  </span>
                  <span className="text-muted text-[15px] leading-[1.6]">{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={transitionBase}
            className="relative aspect-[4/3] rounded-radius-2xl overflow-hidden shadow-premium border border-border"
          >
            <Image
              src={builtForStudentsImage}
              alt={siteContent.builtForStudents.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={90}
              unoptimized={builtForStudentsImage.startsWith("http")}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
