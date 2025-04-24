"use client"

import { useAuth } from "@/components/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { createClientSupabaseClient } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Bookmark, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function UserProfile() {
  const { user, loading } = useAuth()
  const supabase = createClientSupabaseClient()
  const { toast } = useToast()
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
      router.push("/")
      router.refresh()
    }
  }

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/login">
          <UserIcon className="h-4 w-4 mr-2" />
          Sign In
        </Link>
      </Button>
    )
  }

  const avatarUrl = user.user_metadata?.avatar_url
  const fullName = user.user_metadata?.full_name
  const email = user.email
  const fallbackName = fullName || email?.split('@')[0] || 'User'
  const fallbackInitial = fallbackName?.[0]?.toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={fallbackName} />}
            <AvatarFallback>{fallbackInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(fullName || email) && (
          <>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {fullName && <p className="font-medium">{fullName}</p>}
                {email && <p className="text-sm text-muted-foreground">{email}</p>}
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href="/my-summaries" className="cursor-pointer">
            <Bookmark className="mr-2 h-4 w-4" />
            <span>My Summaries</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
