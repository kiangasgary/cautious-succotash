"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Youtube } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function YoutubeForm() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!url.trim() || !isValidYoutubeUrl(url)) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Extract video ID
      const videoId = extractVideoId(url)

      // Redirect to summary page with video ID
      router.push(`/summary?videoId=${videoId}`)
    } catch (error) {
      console.error("Error processing URL:", error)
      toast({
        title: "Error",
        description: "Failed to process the YouTube URL",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const isValidYoutubeUrl = (url: string): boolean => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/
    return regex.test(url)
  }

  const extractVideoId = (url: string): string => {
    const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regex)

    if (match && match[2].length === 11) {
      return match[2]
    }

    throw new Error("Could not extract video ID")
  }

  return (
    <Card className="w-full shadow-md border-2">
      <CardContent className="pt-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-semibold text-center mb-4">Enter a YouTube URL to get started</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Paste YouTube URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 py-6 text-lg"
              />
              <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button type="submit" disabled={isLoading} className="md:w-auto w-full py-6 text-lg">
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Processing...
                </>
              ) : (
                "Summarize"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
