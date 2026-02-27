/**
 * Premium motion system for LeaseU
 * Easing: [0.22, 1, 0.36, 1]
 */

export const easeOutCubic = [0.22, 1, 0.36, 1] as const
export const transitionFast = { duration: 0.22, ease: easeOutCubic }
export const transitionBase = { duration: 0.32, ease: easeOutCubic }
export const transitionSlow = { duration: 0.36, ease: easeOutCubic }

export const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.32, ease: easeOutCubic },
}

export const fadeUpSubtle = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: transitionBase,
}

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
}

export const staggerItem = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: transitionBase },
}

export const heroStagger = {
  badge: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { ...transitionBase, delay: 0 },
  },
  headline: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { ...transitionBase, delay: 0.1 },
  },
  subtext: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { ...transitionBase, delay: 0.2 },
  },
  buttons: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { ...transitionBase, delay: 0.3 },
  },
  stats: {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.32, ease: easeOutCubic, delay: 0.36 },
  },
}

export const cardHoverTransition = { duration: 0.22, ease: easeOutCubic }

export const modalTransition = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { type: "spring", damping: 25, stiffness: 300 },
}
