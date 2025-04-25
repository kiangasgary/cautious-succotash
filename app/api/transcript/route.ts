import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { google } from 'googleapis';

async function getTranscriptFromYoutubeAPI(videoId: string): Promise<string> {
  const youtube = google.youtube('v3');
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error('YouTube API key is not configured');
  }

  try {
    // First, get the caption tracks
    const captions = await youtube.captions.list({
      key: apiKey,
      part: ['snippet'],
      videoId: videoId
    });

    if (!captions.data.items || captions.data.items.length === 0) {
      throw new Error('No captions available for this video');
    }

    // Get the first available caption track
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

    return transcript;
  } catch (error: any) {
    throw new Error(`YouTube API error: ${error.message}`);
  }
}

async function getTranscriptUsingThirdParty(videoId: string): Promise<string> {
  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    if (!transcriptItems || transcriptItems.length === 0) {
      throw new Error('No transcript available for this video');
    }
    return transcriptItems.map(item => item.text).join(' ');
  } catch (error: any) {
    throw new Error(`youtube-transcript error: ${error.message}`);
  }
}

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

    const errors: Error[] = [];

    // Try YouTube API first
    try {
      const transcript = await getTranscriptFromYoutubeAPI(videoId);
      return NextResponse.json({ transcript });
    } catch (error: any) {
      console.error('YouTube API failed:', error);
      errors.push(error);
    }

    // Fallback to youtube-transcript
    try {
      const transcript = await getTranscriptUsingThirdParty(videoId);
      return NextResponse.json({ transcript });
    } catch (error: any) {
      console.error('youtube-transcript failed:', error);
      errors.push(error);
    }

    // If both methods fail, return error
    const errorMessages = errors.map(e => e.message).join('; ');
    return NextResponse.json(
      { error: `Failed to fetch transcript: ${errorMessages}` },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('Error in transcript route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}
