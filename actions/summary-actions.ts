"use server"

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from "next/cache"

interface SummaryPoint {
  emoji: string
  text: string
}

export async function saveSummary(videoId: string, videoTitle: string, summaryPoints: SummaryPoint[]) {
  try {
    const supabase = createServerComponentClient({ cookies })

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error("Auth error:", userError)
      return { success: false, error: "Authentication error. Please try logging in again." }
    }

    if (!user) {
      return { success: false, error: "You must be logged in to save summaries" }
    }

    // Check if summary already exists for this user and video
    const { data: existingSummary, error: existingError } = await supabase
      .from("summaries")
      .select("id")
      .eq("user_id", user.id)
      .eq("video_id", videoId)
      .single()

    if (existingError && existingError.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw existingError
    }

    if (existingSummary) {
      // Update existing summary
      const { error: updateError } = await supabase
        .from("summaries")
        .update({
          video_title: videoTitle,
          summary_points: summaryPoints,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSummary.id)

      if (updateError) throw updateError

      revalidatePath("/my-summaries")
      return { success: true, message: "Summary updated successfully" }
    } else {
      // Insert new summary
      const { error: insertError } = await supabase.from("summaries").insert({
        user_id: user.id,
        video_id: videoId,
        video_title: videoTitle,
        summary_points: summaryPoints,
        created_at: new Date().toISOString(),
      })

      if (insertError) throw insertError

      revalidatePath("/my-summaries")
      return { success: true, message: "Summary saved successfully" }
    }
  } catch (error: any) {
    console.error("Error saving summary:", error)
    return { 
      success: false, 
      error: error.message || "Failed to save summary",
      details: error.details || error.hint || null
    }
  }
}

export async function getUserSummaries() {
  try {
    const supabase = createServerComponentClient({ cookies })

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error("Auth error:", userError)
      return { success: false, error: "Authentication error. Please try logging in again." }
    }

    if (!user) {
      return { success: false, error: "You must be logged in to view summaries" }
    }

    // Get all summaries for the current user
    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, summaries: data }
  } catch (error: any) {
    console.error("Error getting summaries:", error)
    return { 
      success: false, 
      error: error.message || "Failed to get summaries",
      details: error.details || error.hint || null
    }
  }
}

export async function deleteSummary(summaryId: string) {
  try {
    const supabase = createServerComponentClient({ cookies })

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error("Auth error:", userError)
      return { success: false, error: "Authentication error. Please try logging in again." }
    }

    if (!user) {
      return { success: false, error: "You must be logged in to delete summaries" }
    }

    // Delete the summary
    const { error } = await supabase
      .from("summaries")
      .delete()
      .eq("id", summaryId)
      .eq("user_id", user.id)

    if (error) throw error

    revalidatePath("/my-summaries")
    return { success: true, message: "Summary deleted successfully" }
  } catch (error: any) {
    console.error("Error deleting summary:", error)
    return { 
      success: false, 
      error: error.message || "Failed to delete summary",
      details: error.details || error.hint || null
    }
  }
}
