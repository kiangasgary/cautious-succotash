import Link from "next/link"
import { UserProfile } from "@/components/auth/user-profile"
import { Youtube, History } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between max-w-screen-2xl px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Youtube className="h-6 w-6" />
          <span className="font-bold inline-block">YouTube Summarizer</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/history" passHref>
            <Button variant="ghost" size="icon" aria-label="History">
              <History className="h-5 w-5" />
            </Button>
          </Link>
          <UserProfile />
        </div>
      </div>
    </header>
  )
}
