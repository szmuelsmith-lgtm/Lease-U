import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Nav } from "@/components/nav"
import { siteContent } from "@/content/siteContent"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">{siteContent.notFound.title}</h1>
        <p className="text-muted mb-8">{siteContent.notFound.description}</p>
        <Button asChild>
          <Link href="/">{siteContent.notFound.cta}</Link>
        </Button>
      </div>
    </div>
  )
}
