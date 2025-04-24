'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClientSupabaseClient } from '@/lib/supabase'
import { Icons } from '@/components/icons'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientSupabaseClient()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/'
  const { toast } = useToast()

  const handleSignIn = async () => {
    if (!supabase) {
      toast({
        title: "Error",
        description: "Authentication service unavailable",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in with Google:', error)
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleSignIn}
      className="w-full"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.google className="mr-2 h-4 w-4" />
      )}
      Continue with Google
    </Button>
  )
} 