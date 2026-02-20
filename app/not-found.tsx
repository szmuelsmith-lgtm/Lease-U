import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Nav } from "@/components/nav"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg_right">
      <Nav />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">404</h1>
        <p className="text-text-muted mb-8">Page not found</p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
