import { createClient } from "@/lib/supabase/server"
import { transformMessage } from "@/lib/transforms"
import { redirect } from "next/navigation"
import { Nav } from "@/components/nav"
import { MessagesClient } from "@/components/messages-client"

export default async function MessagesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?callbackUrl=/messages")

  const { data: rows } = await supabase
    .from("messages")
    .select(`
      *,
      listing:listings!listing_id(id, title),
      from_user:profiles!from_user_id(id, email),
      to_user:profiles!to_user_id(id, email)
    `)
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  const messages = (rows ?? []).map(transformMessage)

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="container mx-auto px-4 md:px-8 py-12">
        <MessagesClient messages={messages} currentUserId={user.id} />
      </div>
    </div>
  )
}
