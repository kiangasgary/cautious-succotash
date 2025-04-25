import { YoutubeTranscript } from 'youtube-transcript';

interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

export interface VideoDetails {
  title: string;
  transcript: string;
}

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

async function getTranscriptUsingYoutubeAPI(videoId: string): Promise<string> {
  console.log('[YouTube API] Attempting to fetch transcript using YouTube API');
  
  try {
    // Call our server-side API endpoint that handles YouTube API calls
    const response = await fetch(`/api/transcript?videoId=${videoId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch transcript from YouTube API');
    }
    
    if (!data.transcript) {
      throw new Error('No transcript available');
    }

    console.log('[YouTube API] Successfully fetched transcript');
    return data.transcript;
  } catch (error: any) {
    console.error('[YouTube API] Error fetching transcript:', error);
    throw error;
  }
}

async function getTranscriptUsingThirdParty(videoId: string): Promise<string> {
  console.log('[Third Party] Attempting to fetch transcript using youtube-transcript');
  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId) as TranscriptItem[];
    if (transcriptItems && transcriptItems.length > 0) {
      console.log('[Third Party] Successfully fetched transcript');
      return transcriptItems.map((item: TranscriptItem) => item.text).join(' ');
    }
    throw new Error('No transcript items found');
  } catch (error: any) {
    console.error('[Third Party] Error fetching transcript:', error);
    throw error;
  }
}

export async function getVideoTranscript(urlOrId: string): Promise<string> {
  const videoId = extractVideoId(urlOrId);
  console.log('Fetching transcript for video ID:', videoId);

  // Try all available methods to get the transcript
  const errors: Error[] = [];

  // Method 1: Try youtube-transcript package
  try {
    return await getTranscriptUsingThirdParty(videoId);
  } catch (error: any) {
    console.log('youtube-transcript failed, trying YouTube API:', error);
    errors.push(error);
  }

  // Method 2: Try YouTube API
  try {
    return await getTranscriptUsingYoutubeAPI(videoId);
  } catch (error: any) {
    console.log('YouTube API failed:', error);
    errors.push(error);
  }

  // If all methods fail, throw a comprehensive error
  const errorMessages = errors.map(e => e.message).join('; ');
  throw new Error(`Failed to fetch transcript using all available methods. Errors: ${errorMessages}`);
}

export async function getVideoDetails(urlOrId: string): Promise<VideoDetails> {
  try {
    // Call our server-side API route instead
    const response = await fetch(`/api/youtube?videoUrl=${encodeURIComponent(urlOrId)}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch video details');
    }
    
    if (!data.title || !data.transcript) {
      throw new Error('Invalid response format from server');
    }

    return {
      title: data.title,
      transcript: data.transcript,
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
} 