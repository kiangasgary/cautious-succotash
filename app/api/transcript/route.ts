import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { Innertube } from 'youtubei.js/web';

// Function to get transcript using youtubei.js
async function getTranscriptUsingYoutubei(videoId: string): Promise<string> {
  try {
    const youtube = await Innertube.create({
      lang: 'en',
      location: 'US',
      retrieve_player: false,
    });

    const info = await youtube.getInfo(videoId);
    const transcriptData = await info.getTranscript();
    
    if (!transcriptData?.transcript?.content?.body?.initial_segments) {
      throw new Error('No transcript data available');
    }

    const transcript = transcriptData.transcript.content.body.initial_segments
      .map(segment => segment.snippet.text)
      .join(' ');

    return transcript;
  } catch (error: any) {
    console.error('Youtubei.js error:', error);
    throw new Error(`Failed to fetch transcript using youtubei.js: ${error.message}`);
  }
}

// Function to get transcript using youtube-transcript package
async function getTranscriptUsingYoutubeTranscript(videoId: string): Promise<string> {
  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    if (!transcriptItems || transcriptItems.length === 0) {
      throw new Error('No transcript available for this video');
    }
    return transcriptItems.map(item => item.text).join(' ');
  } catch (error: any) {
    console.error('youtube-transcript error:', error);
    throw error;
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

    // Try youtube-transcript first
    try {
      const transcript = await getTranscriptUsingYoutubeTranscript(videoId);
      return NextResponse.json({ transcript });
    } catch (error: any) {
      console.log('youtube-transcript failed, trying youtubei.js...');
      
      // If youtube-transcript fails, try youtubei.js
      try {
        const transcript = await getTranscriptUsingYoutubei(videoId);
        return NextResponse.json({ transcript });
      } catch (youtubeIError: any) {
        // If both methods fail, return detailed error
        return NextResponse.json(
          { 
            error: 'Failed to fetch transcript using both methods',
            details: {
              youtubeTranscriptError: error.message,
              youtubeiError: youtubeIError.message
            }
          },
          { status: 400 }
        );
      }
    }
  } catch (error: any) {
    console.error('Error in transcript route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}
