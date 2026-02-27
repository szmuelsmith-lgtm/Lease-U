"use client"

import { motion } from "framer-motion"
import { staggerItem, staggerContainer, transitionBase } from "@/lib/motion"
import { siteContent } from "@/content/siteContent"

const steps = siteContent.howItWorks.steps

export function LandingHowItWorks() {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transitionBase}
          className="text-center mb-16"
        >
          <div className="w-16 h-px bg-border mx-auto mb-6" />
          <h2 className="text-section md:text-3xl font-bold text-foreground">
            {siteContent.howItWorks.title}
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 md:gap-8"
        >
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={staggerItem}
              className="p-8 rounded-radius-2xl bg-white border border-border shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all duration-220"
            >
              <div className="w-14 h-14 rounded-full bg-garnet text-white flex items-center justify-center font-bold text-xl mb-6">
                {step.num}
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-3">{step.title}</h3>
              <p className="text-muted text-[15px] leading-[1.6]">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
