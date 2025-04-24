import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

// Function to extract video ID from YouTube URL
function extractVideoId(urlOrId: string): string {
  try {
    // If it's already an ID (11 characters), return it
    if (urlOrId.length === 11) {
      return urlOrId;
    }

    // Try to extract ID from URL
    const url = new URL(urlOrId);
    let videoId = '';

    if (url.hostname.includes('youtube.com')) {
      // Handle youtube.com URLs
      videoId = url.searchParams.get('v') || '';
    } else if (url.hostname === 'youtu.be') {
      // Handle youtu.be URLs
      videoId = url.pathname.slice(1);
    }

    if (!videoId) {
      throw new Error('Could not extract video ID from URL');
    }

    return videoId;
  } catch (error) {
    // If URL parsing fails, assume it's a direct video ID
    if (urlOrId.length === 11) {
      return urlOrId;
    }
    throw new Error('Invalid YouTube URL or video ID');
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('videoUrl');

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(videoUrl);
    console.log('Fetching transcript for video ID:', videoId);

    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcriptItems || transcriptItems.length === 0) {
      return NextResponse.json(
        { error: 'No transcript available for this video' },
        { status: 404 }
      );
    }

    const transcript = transcriptItems.map(item => item.text).join(' ');
    
    return NextResponse.json({ 
      transcript,
      videoId,
      title: `Video ${videoId}` // You can enhance this with actual video title later
    });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}
