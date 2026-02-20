import { Nav } from "@/components/nav"
import { AuthModal } from "@/components/auth-modal"

export default function SignupPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <AuthModal open={true} onOpenChange={() => {}} mode="signup" />
      </div>
    </div>
  )
}
