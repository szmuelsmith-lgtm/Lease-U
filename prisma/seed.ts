import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create admin user
  const adminPassword = await bcrypt.hash("leaseu-admin", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@leaseu.edu" },
    update: {},
    create: {
      email: "admin@leaseu.edu",
      name: "Admin",
      passwordHash: adminPassword,
      role: "ADMIN",
      emailVerified: true,
      eduVerified: true,
    },
  })

  // Create host user
  const hostPassword = await bcrypt.hash("password123", 10)
  const host = await prisma.user.upsert({
    where: { email: "sarah@fsu.edu" },
    update: {},
    create: {
      email: "sarah@fsu.edu",
      name: "Sarah M.",
      passwordHash: hostPassword,
      role: "HOST",
      emailVerified: true,
      eduVerified: true,
    },
  })

  // Create another host
  const host2 = await prisma.user.upsert({
    where: { email: "mike@uf.edu" },
    update: {},
    create: {
      email: "mike@uf.edu",
      name: "Mike T.",
      passwordHash: hostPassword,
      role: "HOST",
      emailVerified: true,
      eduVerified: true,
    },
  })

  // FSU Listings
  const fsuListings = [
    {
      universitySlug: "fsu",
      title: "Urgent: Need Lease Takeover at Stadium Centre",
      locationCity: "Tallahassee",
      locationState: "FL",
      priceDisplay: "$750 /month",
      coverImageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      beds: 2,
      baths: 2,
      availableDate: new Date("2024-06-01"),
      listingType: "LEASE_TAKEOVER" as const,
      description: "Beautiful 2BR/2BA apartment at Stadium Centre. Walking distance to FSU campus. Fully furnished, utilities included. Need someone to take over lease starting June 1st. Great location, safe neighborhood.",
      verifiedStudentOnly: true,
      status: "APPROVED" as const,
      hostId: host.id,
    },
    {
      universitySlug: "fsu",
      title: "Private Room in Quiet Townhouse",
      locationCity: "Tallahassee",
      locationState: "FL",
      priceDisplay: "$550 /month",
      coverImageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      beds: 1,
      baths: 1,
      availableDate: new Date("2024-05-15"),
      listingType: "ROOM" as const,
      description: "Private bedroom available in 3BR townhouse. Shared kitchen and living area. Quiet neighborhood, 10 min drive to campus. Looking for responsible roommate. No pets, non-smoking.",
      verifiedStudentOnly: true,
      status: "APPROVED" as const,
      hostId: host.id,
    },
    {
      universitySlug: "fsu",
      title: "Summer Sublease - The Standard",
      locationCity: "Tallahassee",
      locationState: "FL",
      priceDisplay: "$850 /month",
      coverImageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      beds: 1,
      baths: 1,
      availableDate: new Date("2024-05-01"),
      listingType: "SUBLET" as const,
      description: "Subletting my 1BR apartment at The Standard for summer semester (May-August). Fully furnished, all utilities included. Pool, gym, study rooms. Perfect for summer classes!",
      verifiedStudentOnly: false,
      status: "APPROVED" as const,
      hostId: host.id,
    },
  ]

  // UF Listings
  const ufListings = [
    {
      universitySlug: "uf",
      title: "Spacious 3BR House Near UF Campus",
      locationCity: "Gainesville",
      locationState: "FL",
      priceDisplay: "$1200 /month",
      coverImageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      beds: 3,
      baths: 2,
      availableDate: new Date("2024-06-15"),
      listingType: "LEASE_TAKEOVER" as const,
      description: "Looking for someone to take over lease on 3BR/2BA house. Great location, 5 min walk to UF. Large backyard, parking included. Perfect for group of students.",
      verifiedStudentOnly: true,
      status: "APPROVED" as const,
      hostId: host2.id,
    },
    {
      universitySlug: "uf",
      title: "Room Available in Shared Apartment",
      locationCity: "Gainesville",
      locationState: "FL",
      priceDisplay: "$600 /month",
      coverImageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      beds: 1,
      baths: 1,
      availableDate: new Date("2024-05-20"),
      listingType: "ROOM" as const,
      description: "One room available in 4BR apartment. Shared common areas. Close to campus and downtown. Looking for clean, respectful roommate.",
      verifiedStudentOnly: true,
      status: "APPROVED" as const,
      hostId: host2.id,
    },
  ]

  // UCF Listings
  const ucfListings = [
    {
      universitySlug: "ucf",
      title: "Modern Apartment Near UCF - Available Now",
      locationCity: "Orlando",
      locationState: "FL",
      priceDisplay: "$900 /month",
      coverImageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      beds: 2,
      baths: 2,
      availableDate: new Date("2024-04-15"),
      listingType: "SUBLET" as const,
      description: "Subletting 2BR/2BA apartment for remainder of lease. Modern amenities, pool, gym. 5 min drive to UCF. Available immediately through August.",
      verifiedStudentOnly: false,
      status: "APPROVED" as const,
      hostId: host.id,
    },
    {
      universitySlug: "ucf",
      title: "Private Bedroom in Student Housing",
      locationCity: "Orlando",
      locationState: "FL",
      priceDisplay: "$650 /month",
      coverImageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      beds: 1,
      baths: 1,
      availableDate: new Date("2024-06-01"),
      listingType: "ROOM" as const,
      description: "Private bedroom in student housing complex. All utilities included. Shuttle to UCF campus. Looking for female roommate.",
      verifiedStudentOnly: true,
      status: "APPROVED" as const,
      hostId: host2.id,
    },
    {
      universitySlug: "ucf",
      title: "Lease Takeover - Knights Circle",
      locationCity: "Orlando",
      locationState: "FL",
      priceDisplay: "$800 /month",
      coverImageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      beds: 2,
      baths: 2,
      availableDate: new Date("2024-07-01"),
      listingType: "LEASE_TAKEOVER" as const,
      description: "Need someone to take over lease at Knights Circle. Great location, fully furnished. Lease runs through next May. Transfer fee negotiable.",
      verifiedStudentOnly: true,
      status: "PENDING" as const,
      hostId: host.id,
    },
  ]

  // Clear existing listings (optional - comment out if you want to keep existing data)
  // await prisma.listing.deleteMany({})

  // Create all listings
  for (const listing of [...fsuListings, ...ufListings, ...ucfListings]) {
    try {
      await prisma.listing.create({
        data: listing,
      })
    } catch (error) {
      // Skip if listing already exists
      console.log(`Skipping duplicate listing: ${listing.title}`)
    }
  }

  console.log("Seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
