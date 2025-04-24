"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ExternalLink, Trash2, Youtube } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { deleteSummary } from "@/actions/summary-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SummaryPoint {
  emoji: string
  text: string
}

interface Summary {
  id: string
  video_id: string
  video_title: string
  summary_points: SummaryPoint[]
  created_at: string
}

interface SavedSummariesProps {
  summaries: Summary[]
  error: string | null
}

export function SavedSummaries({ summaries, error }: SavedSummariesProps) {
  const [deletingSummaryId, setDeletingSummaryId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async (summaryId: string) => {
    setDeletingSummaryId(summaryId)

    try {
      const result = await deleteSummary(summaryId)

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
        description: error.message || "Failed to delete summary",
        variant: "destructive",
      })
    } finally {
      setDeletingSummaryId(null)
    }
  }

  if (error) {
    return (
      <Card className="border-destructive w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Error Loading Summaries</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (summaries.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Youtube className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Saved Summaries</h3>
            <p className="text-muted-foreground mb-6">You haven't saved any video summaries yet.</p>
            <Button asChild>
              <Link href="/">Summarize a Video</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-6">
      {summaries.map((summary) => (
        <Card key={summary.id} className="w-full">
          <CardHeader>
            <CardTitle className="text-xl line-clamp-2">{summary.video_title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              Saved on {new Date(summary.created_at).toLocaleDateString()}
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {summary.summary_points.map((point, index) => (
                <li key={index} className="flex">
                  <span className="mr-2 text-xl">{point.emoji}</span>
                  <span>{point.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`https://www.youtube.com/watch?v=${summary.video_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Watch Video
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this summary.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(summary.id)}
                    disabled={deletingSummaryId === summary.id}
                  >
                    {deletingSummaryId === summary.id ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
