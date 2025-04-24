'use client'

import { createClientSupabaseClient } from "@/lib/supabase"
import { saveSummary as serverSaveSummary } from "./summary-actions"
import type { SummaryPoint } from "@/types/supabase"

export async function saveSummaryFromClient(videoId: string, videoTitle: string, summaryPoints: SummaryPoint[]) {
  try {
    const supabase = createClientSupabaseClient()
    
    // First check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      throw new Error("Authentication failed. Please try logging in again.")
    }

    if (!user) {
      throw new Error("You must be logged in to save summaries")
    }

    // Call the server action to save the summary
    return await serverSaveSummary(videoId, videoTitle, summaryPoints)
  } catch (error: any) {
    console.error("Error in client save summary:", error)
    return {
      success: false,
      error: error.message || "Failed to save summary",
      details: error.details || error.hint || null
    }
  }
} 