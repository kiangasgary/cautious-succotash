import { YoutubeTranscript } from 'youtube-transcript';

async function testTranscript() {
  try {
    // Using a known public video with captions (a TED talk)
    const videoId = 'UF8uR6Z6KLc';  // Steve Jobs' Stanford Commencement Speech
    console.log('Attempting to fetch transcript for video:', videoId);
    
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    console.log('Transcript fetched successfully!');
    console.log('First few lines:', transcript.slice(0, 3));
  } catch (error) {
    console.error('Error fetching transcript:', error);
  }
}

testTranscript(); 