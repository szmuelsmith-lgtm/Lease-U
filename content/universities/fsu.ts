/**
 * FSU-specific overrides.
 * To adapt LeaseU for a different university, copy this file,
 * change the values, and update the import in siteContent.ts.
 */
export const fsu = {
  name: "Florida State University",
  shortName: "FSU",
  domain: "fsu.edu",
  brandColors: {
    primary: "#8B1E3F",
    accent: "#C9A227",
  },
  copy: {
    heroBadge: "Made for FSU Students",
    heroSubheadline:
      "Sublets, lease takeovers, and rooms — FSU .edu verified. Browse freely. Post when ready.",
    ctaDescription:
      "Join thousands of FSU students finding and posting campus housing.",
    eduHint:
      "@fsu.edu = can post listings & message. Any email = browse only.",
    verifiedLabel: "FSU Verified",
  },
} as const
