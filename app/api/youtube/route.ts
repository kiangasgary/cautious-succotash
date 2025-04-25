import { NextResponse } from 'next/server';
import { google } from 'googleapis';
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

async function getVideoTranscript(videoId: string): Promise<string> {
  console.log('Fetching transcript for video ID:', videoId);

  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    if (!transcriptItems || transcriptItems.length === 0) {
      throw new Error('No transcript available for this video');
    }
    return transcriptItems.map(item => item.text).join(' ');
  } catch (error: any) {
    console.error('Error fetching transcript:', error);
    
    // Handle specific error types
    if (error.message?.includes('Transcript is disabled')) {
      throw new Error('This video does not have captions enabled. Please try a different video that has captions.');
    }
    if (error.message?.includes('Video is unavailable')) {
      throw new Error('This video is unavailable or private. Please make sure the video is public and accessible.');
    }
    if (error.message?.includes('ERR_NETWORK')) {
      throw new Error('Network error while fetching transcript. Please check your internet connection and try again.');
    }
    
    // If it's a different error, provide a more helpful message
    throw new Error(`Could not fetch video transcript. Reason: ${error.message || 'Unknown error'}`);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('videoUrl');

    if (!videoUrl) {
      console.error('No video URL provided');
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(videoUrl);
    console.log('Processing video ID:', videoId);
    
    // Get video details using YouTube API
    const youtube = google.youtube('v3');
    const apiKey = process.env.YOUTUBE_API_KEY?.trim(); // Trim any whitespace

    if (!apiKey) {
      console.error('YouTube API key is missing');
      return NextResponse.json(
        { error: 'YouTube API key is not configured' },
        { status: 500 }
      );
    }

    console.log('Attempting to fetch video details with API key:', apiKey.substring(0, 5) + '...');

    // First get video details
    let videoTitle: string;
    try {
      const videoResponse = await youtube.videos.list({
        key: apiKey,
        part: ['snippet'],
        id: [videoId]
      });

      console.log('Video API Response:', JSON.stringify(videoResponse.data, null, 2));

      if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
        console.error('No video found for ID:', videoId);
        return NextResponse.json(
          { error: 'Video not found or is private. Please make sure the video exists and is public.' },
          { status: 404 }
        );
      }

      videoTitle = videoResponse.data.items[0].snippet?.title || `Video ${videoId}`;
      console.log('Found video:', videoTitle);
    } catch (error: any) {
      console.error('Error fetching video details:', error);
      console.error('Error response:', error.response?.data);
      return NextResponse.json(
        { 
          error: 'Failed to fetch video details from YouTube.',
          details: error.message,
          response: error.response?.data
        },
        { status: 500 }
      );
    }

    // Then get transcript
    try {
      const transcript = await getVideoTranscript(videoId);
      console.log('Successfully fetched transcript');

      return NextResponse.json({
        title: videoTitle,
        transcript,
        videoId
      });
    } catch (error: any) {
      console.error('Transcript error:', error.message);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch video transcript' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error in YouTube API route:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process request',
        stack: error.stack
      },
      { status: 500 }
    );
  }
} 