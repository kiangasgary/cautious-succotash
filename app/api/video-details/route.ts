import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get("videoId")

  if (!videoId) {
    return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
  }

  try {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
    if (!YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured")
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
    )

    if (!response.ok) {
      const error = await response.json()
      console.error("YouTube API error:", error)
      return NextResponse.json(
        { error: error.error?.message || "Failed to fetch video details" },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const videoDetails = {
      title: data.items[0].snippet.title,
      channelTitle: data.items[0].snippet.channelTitle,
      publishedAt: data.items[0].snippet.publishedAt,
      description: data.items[0].snippet.description,
    }

    return NextResponse.json(videoDetails)
  } catch (error) {
    console.error("Error fetching video details:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch video details" },
      { status: 500 }
    )
  }
}
