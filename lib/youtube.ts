import { YoutubeTranscript } from 'youtube-transcript';
import { withTimeout, isTimeoutError } from './utils';

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

export async function getVideoTranscript(urlOrId: string): Promise<string> {
  const videoId = extractVideoId(urlOrId);
  console.log('Fetching transcript for video ID:', videoId);

  try {
    const response = await withTimeout(
      fetch(`/api/transcript?videoId=${videoId}`),
      30000
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch transcript');
    }

    return data.transcript;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    if (isTimeoutError(error)) {
      throw new Error('The request timed out. Please try again.');
    }
    throw error;
  }
}

export async function getVideoDetails(urlOrId: string): Promise<VideoDetails> {
  try {
    const response = await withTimeout(
      fetch(`/api/youtube?videoUrl=${encodeURIComponent(urlOrId)}`),
      30000
    );
    
    const data = await response.json();
    
    // The server might return a non-200 status with a specific error message
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
  } catch (error: any) {
    console.error('Error fetching video details:', error);
    if (isTimeoutError(error)) {
      throw new Error('The request timed out. Please try again.');
    }
    // Just pass through the error message if it's already well-formatted
    if (error.message && (
      error.message.includes('captions') || 
      error.message.includes('transcript') ||
      error.message.includes('unavailable')
    )) {
      throw error;
    }
    throw new Error(`Could not process video: ${error.message || 'Unknown error'}`);
  }
} 