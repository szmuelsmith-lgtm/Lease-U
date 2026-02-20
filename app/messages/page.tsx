import { Nav } from "@/components/nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MessageSquare } from "lucide-react"

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-bg_right">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-2">Messages</h1>
          <p className="text-text-muted mb-8">
            Connect with other students about listings.
          </p>

          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-text-muted" />
              <h2 className="text-xl font-semibold mb-2">No messages yet</h2>
              <p className="text-text-muted mb-6">
                When you contact a listing poster or someone messages you, your conversations will appear here.
              </p>
              <Button asChild>
                <a href="/u/fsu">Browse Listings</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
