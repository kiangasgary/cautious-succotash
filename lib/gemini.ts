import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export interface SummaryPoint {
  emoji: string;
  text: string;
}

export async function generateSummaryWithGemini(transcript: string, videoTitle: string): Promise<SummaryPoint[]> {
  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript,
        videoTitle,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate summary');
    }

    const data = await response.json();
    return data.summaryPoints;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

function parseSummaryPoints(text: string): SummaryPoint[] {
  // Split the text into lines and filter out empty lines
  const lines = text.split('\n').filter(line => line.trim() !== '');

  return lines.map(line => {
    // Extract emoji and text using regex
    const match = line.match(/^[•\-*]?\s*(\p{Emoji})[:\s]+(.+)$/u);
    
    if (match) {
      return {
        emoji: match[1],
        text: match[2].trim()
      };
    }

    // Fallback if the format doesn't match exactly
    const emojiMatch = line.match(/(\p{Emoji})/u);
    return {
      emoji: emojiMatch ? emojiMatch[1] : '📌',
      text: line.replace(/^[•\-*]?\s*\p{Emoji}/u, '').trim()
    };
  });
} 