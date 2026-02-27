import { getSession } from "@/lib/auth"
import { PostWizard } from "@/components/post-wizard"
import { HostGate } from "@/components/host-gate"
import { Nav } from "@/components/nav"

export default async function PostPage() {
  const session = await getSession()
  const profile = session?.profile
  const canPost =
    profile &&
    (profile.role === "HOST" || profile.role === "ADMIN") &&
    profile.eduVerified

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-2xl">
        {canPost ? <PostWizard /> : <HostGate />}
      </div>
    </div>
  )
}
