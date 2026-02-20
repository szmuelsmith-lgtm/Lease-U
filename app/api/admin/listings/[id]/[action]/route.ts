import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: { id: string; action: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, id } = params

    if (action === "approve") {
      await prisma.listing.update({
        where: { id },
        data: { status: "APPROVED" },
      })
      return NextResponse.json({ success: true })
    }

    if (action === "reject") {
      await prisma.listing.update({
        where: { id },
        data: { status: "REJECTED" },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
