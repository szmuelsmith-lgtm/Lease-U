export const siteContent = {
  brand: {
    name: ["Lease", "U"] as const,
  },

  nav: {
    links: [
      { href: "/", label: "Home" },
      { href: "/browse", label: "Browse" },
      { href: "/post", label: "Post" },
      { href: "/messages", label: "Messages" },
    ],
    admin: "Admin",
    logOut: "Log out",
    logIn: "Log in",
    signUp: "Sign up",
  },

  hero: {
    badge: "Made for FSU Students",
    headlinePart1: "Find Your Perfect ",
    headlineAccent: "Campus Housing",
    subheadline:
      "Sublets, lease takeovers, and rooms — FSU .edu verified. Browse freely. Post when ready.",
    primaryCTA: "Browse Listings",
    secondaryCTA: "Post Your Lease",
  },

  stats: [
    { value: "150+", label: "Active Listings" },
    { value: "2,400+", label: "Students Connected" },
    { value: "< 2hrs", label: "Avg Response" },
    { value: "100%", label: "FSU Verified" },
  ],

  howItWorks: {
    title: "How It Works",
    steps: [
      {
        num: "1",
        title: "Sign Up with .edu",
        desc: "FSU email to post; any email to browse and message.",
      },
      {
        num: "2",
        title: "Browse or Post",
        desc: "Sublets, takeovers, rooms. List yours — FSU students only.",
      },
      {
        num: "3",
        title: "Connect Safely",
        desc: "Message hosts directly. Verified listings. No spam.",
      },
    ],
  },

  urgentListings: {
    title: "Urgent Listings",
    urgentBadge: "Urgent",
    verifiedBadge: "Verified",
    viewDetails: "View Details",
  },

  featuredListings: {
    title: "Featured Listings",
    verifiedBadge: "Verified",
    viewDetails: "View Details",
    defaultHostName: "FSU Student",
  },

  builtForStudents: {
    title: "Built for Students",
    imageAlt: "Campus housing",
    features: [
      "Verified .edu emails only for listings",
      "Boost your listing to stand out",
      "In-app messaging with hosts",
    ],
  },

  cta: {
    title: "Ready to Find Your Place?",
    description:
      "Join thousands of FSU students finding and posting campus housing.",
    button: "Browse Listings",
  },

  browse: {
    searchPlaceholder: "Search listings...",
    searchButton: "Search",
    filtersButton: "Filters",
    filtersTitle: "Filters",
    priceRangeLabel: "Price range ($)",
    minBedroomsLabel: "Min bedrooms",
    listingTypeLabel: "Listing type",
    typeOptions: [
      { value: "", label: "Any" },
      { value: "lease_takeover", label: "Lease Takeover" },
      { value: "sublet", label: "Sublet" },
      { value: "room", label: "Room for Rent" },
    ],
    applyButton: "Apply",
    emptyState: "No listings found.",
    emptyStateCTA: "Post one",
    verifiedBadge: "Verified",
    viewDetails: "View Details",
    defaultHostName: "FSU Student",
    typeLabels: {
      lease_takeover: "Lease Takeover",
      sublet: "Sublet",
      room: "Room for Rent",
    } as Record<string, string>,
  },

  auth: {
    loginHeading: "Log in",
    loginButton: "Log in",
    loginLoading: "Signing in…",
    loginRegisteredBanner: "Account created! You can now log in.",
    loginNoAccount: "Don't have an account?",
    loginSignUpLink: "Sign up",
    loginEmailPlaceholder: "you@fsu.edu",
    loginEmailLabel: "Email",
    loginPasswordLabel: "Password",
    errorInvalidCredentials:
      "Invalid email or password. Make sure the account exists.",
    errorEmailNotConfirmed:
      "Email not confirmed. Check your inbox and verify your email first.",
    errorRateLimit: "Too many attempts. Wait a moment and try again.",
    errorNetwork:
      "Network error. Please check your connection and try again.",

    signupHeading: "Sign up",
    signupButton: "Sign up",
    signupLoading: "Creating account…",
    signupNameLabel: "Name (optional)",
    signupNamePlaceholder: "Your name",
    signupEmailPlaceholder: "you@fsu.edu or you@gmail.com",
    signupEmailHint:
      "@fsu.edu = can post listings & message. Any email = browse only.",
    signupPasswordLabel: "Password (min 6 characters)",
    signupHasAccount: "Already have an account?",
    signupLogInLink: "Log in",
    errorPasswordLength: "Password must be at least 6 characters.",
    errorAlreadyRegistered:
      "An account with this email already exists. Try logging in.",
  },

  postListing: {
    heading: "Post a Listing",
    subheading: "Help fellow students find their next home",
    step1Title: "What type of listing?",
    types: [
      {
        value: "lease_takeover" as const,
        label: "Lease Takeover",
        desc: "I'm leaving my lease and need someone to take over",
      },
      {
        value: "sublet" as const,
        label: "Sublet",
        desc: "I'm subletting my place for a period",
      },
      {
        value: "room" as const,
        label: "Room for Rent",
        desc: "I have available rooms in my place to fill",
      },
    ],
    detailsCardTitle: {
      lease_takeover: "Lease Takeover Details",
      sublet: "Sublet Details",
      room: "Room for Rent Details",
    } as Record<string, string>,
    detailsCardDescription: "Fill in the details about your listing",
    labels: {
      title: "Title",
      titlePlaceholder: "e.g. Stadium Centre 2BR — Available May",
      monthlyRent: "Monthly Rent ($)",
      rentPlaceholder: "750",
      beds: "Beds",
      baths: "Baths",
      availableDate: "Available Date",
      description: "Description",
      descriptionPlaceholder:
        "Describe your place, amenities, why you're moving, ideal roommate, etc.",
      coverImageUrl: "Cover Image URL (optional)",
      coverImagePlaceholder: "https://...",
    },
    sections: {
      basicInfo: "Basic Info",
      leaseInfo: "Lease Information",
      descriptionAndImage: "Description & Image",
    },
    backButton: "Back",
    continueButton: "Continue",
    boostTitle: "Boost Your Listing",
    boostDescription:
      "Get seen first! Boosted listings appear at the top of search results and are featured on the homepage.",
    boostBadges: ["Featured Badge", "Top of Results", "3x More Views"],
    boostPrice: "$15 one-time boost (coming soon — free for now)",
    reviewTitle: "Review Your Listing",
    reviewLabels: {
      type: "Type:",
      title: "Title:",
      price: "Price:",
      bedsBaths: "Beds / Baths:",
      boost: "Boost:",
    },
    submitButton: "Post Listing",
    submitLoading: "Submitting…",
    errorInvalidPrice: "Please enter a valid price (e.g. 750)",
    successTitle: "Listing Submitted for Approval",
    successDescription:
      "Your listing will be visible once an admin approves it. Redirecting…",
  },

  hostGate: {
    signInTitle: "Sign in to post",
    signInDescription: "You need to be signed in to create a listing.",
    signInButton: "Log in",
    verifiedTitle: "Only verified FSU students can post listings",
    verifiedDescription:
      "Sign up with your @fsu.edu email to post. Other emails can browse and message.",
    learnMore: "Learn more",
    dialogTitle: "Only verified FSU students can post listings",
    dialogDescription:
      "Use your @fsu.edu email to sign up. Once verified, you can post lease replacements, rooms for rent, and more. Other emails can browse and message hosts.",
    dialogCTA: "Browse Listings",
  },

  listingActions: {
    signInPrompt: "Sign in to message the host",
    signInButton: "Log in",
    eduOnlyPrompt: "Only verified @fsu.edu accounts can message hosts.",
    messageHostButton: "Message host",
    messageDialogTitle: "Message host",
    messageDialogDescription: "Send a message about this listing.",
    messageLabel: "Message",
    messagePlaceholder: "Hi, I'm interested in this listing...",
    sendButton: "Send",
    sendLoading: "Sending…",
    messageSent: "Message sent!",
    reportButton: "Report",
    reportDialogTitle: "Report Listing",
    reportDialogDescription:
      "Let us know why this listing should be reviewed.",
    reportReasonLabel: "Reason",
    reportReasonPlaceholder: "Spam, misleading, inappropriate, etc.",
    reportSubmitButton: "Submit Report",
    reportSubmitLoading: "Submitting…",
    reportSent: "Report submitted. Thank you.",
  },

  messages: {
    heading: "Messages",
    emptyTitle: "No messages yet",
    emptyDescription:
      "Message a host about a listing — your conversations will appear here.",
    emptyCTA: "Browse Listings",
  },

  admin: {
    heading: "Admin Dashboard",
    tabs: {
      pending: "Pending",
      approved: "Approved",
      removed: "Removed",
      reports: "Reports",
      siteImages: "Site Images",
    },
    emptyPending: "No pending listings.",
    emptyApproved: "No approved listings.",
    emptyRemoved: "No removed listings.",
    emptyReports: "No reports.",
    approveButton: "Approve",
    rejectButton: "Reject",
    removeButton: "Remove",
    viewButton: "View",
    siteImagesTitle: "Change Pictures & Backgrounds",
    siteImagesDescription:
      "Use local paths (e.g. /images/hero.jpg) or full URLs (e.g. https://...). Changes apply site-wide.",
    heroImageLabel: "Hero Background",
    builtForStudentsImageLabel: "Built for Students Section",
    listingFallbackImageLabel: "Listing Fallback (no cover image)",
    saveImagesButton: "Save Images",
    savingImagesButton: "Saving…",
    notAuthorizedTitle: "Not Authorized",
    notAuthorizedDescription: "Only admin accounts can access this page.",
    notAuthorizedLink: "← Back to Browse",
  },

  notFound: {
    title: "404",
    description: "Page not found",
    cta: "Go Home",
  },

  listingDetail: {
    backLink: "← Back to listings",
    defaultHostName: "FSU Student",
    typeLabels: {
      lease_takeover: "Lease Takeover",
      sublet: "Sublet",
      room: "Room for Rent",
      SUBLET: "Sublet",
      LEASE_TAKEOVER: "Lease Takeover",
      ROOM: "Room Rental",
    } as Record<string, string>,
    verifiedBadge: "Verified students only",
    locationLabel: "Location",
    availableLabel: "Available",
    roomsLabel: "Rooms",
    descriptionLabel: "Description",
    contactHostTitle: "Contact host",
    postedByLabel: "Posted by",
    anonymousHost: "Anonymous",
    editListingButton: "Edit listing",
  },
} as const

export type SiteContent = typeof siteContent
