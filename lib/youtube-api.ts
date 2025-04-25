import { google } from 'googleapis';

export async function getTranscriptFromYoutubeAPI(videoId: string): Promise<string> {
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