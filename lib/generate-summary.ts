import { getVideoDetails } from './youtube';
import { generateSummaryWithGemini, SummaryPoint } from './gemini';

interface SummaryResult {
  videoTitle: string;
  summaryPoints: SummaryPoint[];
}

export async function generateSummary(videoId: string): Promise<SummaryResult> {
  try {
    // 1. Fetch video details and transcript
    const { title, transcript } = await getVideoDetails(videoId);

    // 2. Generate summary using Google Gemini
    const summaryPoints = await generateSummaryWithGemini(transcript, title);

    return {
      videoTitle: title,
      summaryPoints,
    };
  } catch (error) {
    console.error("Error in generateSummary:", error);
    throw new Error("Failed to generate summary");
  }
}
