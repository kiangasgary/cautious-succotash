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
      throw new Error('No captions available');
    }

    // Get the first available caption track (usually the auto-generated one)
    const captionId = captions.data.items[0].id;

    // Download the caption track
    const captionTrack = await youtube.captions.download({
      key: apiKey,
      id: captionId!
    });

    // Convert the caption track to plain text
    const transcript = captionTrack.data.toString();
    return transcript;
  } catch (error) {
    console.error('Error fetching transcript using YouTube API:', error);
    throw error;
  }
}

export async function getVideoTranscript(urlOrId: string): Promise<string> {
  const videoId = extractVideoId(urlOrId);
  console.log('Fetching transcript for video ID:', videoId);

  // Try using youtube-transcript package first
  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    if (transcriptItems && transcriptItems.length > 0) {
      return transcriptItems.map(item => item.text).join(' ');
    }
  } catch (error) {
    console.log('youtube-transcript failed, trying YouTube API:', error);
  }

  // If youtube-transcript fails, try using YouTube API
  try {
    return await getTranscriptUsingYoutubeAPI(videoId);
  } catch (error) {
    console.error('Both transcript fetching methods failed:', error);
    throw new Error('Could not fetch video transcript. The video might have disabled transcripts or requires authentication.');
  }
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