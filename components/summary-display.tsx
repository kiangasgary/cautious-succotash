"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Share2, Save, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateSummary } from "@/lib/generate-summary"
import { saveSummaryFromClient } from "@/actions/client-actions"
import { useAuth } from "@/components/providers/AuthProvider"

interface SummaryPoint {
  emoji: string
  text: string
}

export function SummaryDisplay() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const videoId = searchParams.get("videoId")
  const [summary, setSummary] = useState<SummaryPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoTitle, setVideoTitle] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!videoId) return

    const fetchSummary = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await generateSummary(videoId)
        setSummary(result.summaryPoints)
        setVideoTitle(result.videoTitle)
      } catch (err) {
        console.error("Error generating summary:", err)
        setError(err instanceof Error ? err.message : "Failed to generate summary. The video might not have captions available.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [videoId])

  const handleCopy = () => {
    const textToCopy = `${videoTitle}\n\n${summary.map((point) => `${point.emoji} ${point.text}`).join("\n")}`
    navigator.clipboard.writeText(textToCopy)
    toast({
      title: "Copied to clipboard",
      description: "Summary has been copied to your clipboard",
    })
  }

  const handleShare = () => {
    if (!videoId) return

    const shareUrl = `${window.location.origin}/summary?videoId=${videoId}`

    if (navigator.share) {
      navigator
        .share({
          title: videoTitle || "YouTube Video Summary",
          text: "Check out this AI-generated summary of a YouTube video!",
          url: shareUrl,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link copied",
        description: "Share link has been copied to your clipboard",
      })
    }
  }

  const handleSave = async () => {
    if (!videoId || !videoTitle) return

    if (!user) {
      const currentPath = `/summary?videoId=${videoId}`;
      router.push(`/login?returnTo=${encodeURIComponent(currentPath)}`);
      return;
    }

    setIsSaving(true)

    try {
      const result = await saveSummaryFromClient(videoId, videoTitle, summary)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save summary",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!videoId) {
    return null
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Summary Generation Failed</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Try Another Video
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-muted rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{videoTitle || "Video Summary"}</CardTitle>
      </CardHeader>
      <CardContent>
        {summary.length > 0 ? (
          <ul className="space-y-3">
            {summary.map((point, index) => (
              <li key={index} className="flex">
                <span className="mr-2 text-xl">{point.emoji}</span>
                <span>{point.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground py-4">No summary points available</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </CardFooter>
    </Card>
  )
}
