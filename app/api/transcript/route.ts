import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const youtube = google.youtube('v3');
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'YouTube API key is not configured' },
        { status: 500 }
      );
    }

    // First, get the caption tracks
    const captions = await youtube.captions.list({
      key: apiKey,
      part: ['snippet'],
      videoId: videoId
    });

    if (!captions.data.items || captions.data.items.length === 0) {
      return NextResponse.json(
        { error: 'No captions available for this video' },
        { status: 404 }
      );
    }

    // Get the first available caption track (usually the auto-generated one)
    const captionId = captions.data.items[0].id;

    // Download the caption track
    const captionTrack = await youtube.captions.download({
      key: apiKey,
      id: captionId!
    });

    // Convert the caption track to plain text
    const transcript = Buffer.isBuffer(captionTrack.data) 
      ? captionTrack.data.toString('utf-8')
      : String(captionTrack.data);

    return NextResponse.json({ transcript });
  } catch (error: any) {
    console.error('Error fetching transcript:', error);
    
    // Handle specific YouTube API errors
    if (error.response?.data?.error) {
      return NextResponse.json(
        { error: error.response.data.error.message },
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}
