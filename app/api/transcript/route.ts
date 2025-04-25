import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

async function getTranscript(videoId: string): Promise<string> {
  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    if (!transcriptItems || transcriptItems.length === 0) {
      throw new Error('No transcript available for this video');
    }
    return transcriptItems.map(item => item.text).join(' ');
  } catch (error: any) {
    if (error.message?.includes('Transcript is disabled')) {
      throw new Error('This video does not have captions enabled. Please try a different video that has captions.');
    }
    if (error.message?.includes('Video is unavailable')) {
      throw new Error('This video is unavailable or private. Please make sure the video is public and accessible.');
    }
    if (error.message?.includes('ERR_NETWORK')) {
      throw new Error('Network error while fetching transcript. Please check your internet connection and try again.');
    }
    throw new Error(`Could not fetch video transcript: ${error.message}`);
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

    const transcript = await getTranscript(videoId);
    return NextResponse.json({ transcript });
  } catch (error: any) {
    console.error('Error in transcript route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transcript' },
      { status: 400 }
    );
  }
}
