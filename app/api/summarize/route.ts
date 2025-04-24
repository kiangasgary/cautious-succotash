import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// List of available models to try
const GEMINI_MODELS = [
  'gemini-pro',  // Start with the most stable model
  'gemini-1.5-pro',
  'gemini-pro-latest'
];

interface SummaryPoint {
  emoji: string;
  text: string;
}

// Initialize the Gemini API with error handling
function initializeGeminiAPI() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured in environment variables");
  }
  
  console.log("Initializing Gemini API with key:", apiKey.substring(0, 10) + "...");
  return new GoogleGenerativeAI(apiKey);
}

const genAI = initializeGeminiAPI();

async function generateSummaryWithGemini(transcript: string, videoTitle: string): Promise<SummaryPoint[]> {
  let lastError = null;
  let modelErrors: Record<string, string> = {};

  // Try each model in order until one works
  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`Attempting to use model: ${modelName}`);
      
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
        Create a detailed summary of this YouTube video transcript in 8-12 bullet points.
        Each point should capture a key concept or moment from the video.
        Make each point informative but concise (15-25 words each).
        Include relevant emojis that match the content of each point.
        
        Important instructions:
        - Cover the main ideas and supporting details
        - Maintain chronological order if relevant
        - Use clear, engaging language
        - Each point should provide valuable information
        - Include specific examples or data mentioned
        
        Video Title: ${videoTitle}
        Transcript: ${transcript.substring(0, Math.min(transcript.length, 10000))} // Limit transcript length
        
        Format each point as: "emoji: text"
        Example format:
        "🎯: The video introduces the concept of machine learning through practical examples in healthcare."
        "💡: Researchers demonstrated a 95% accuracy rate in detecting patterns using their new algorithm."
      `;

      console.log(`Sending request to ${modelName}...`);
      
      // Generate content with timeout
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 30000)
        )
      ]);

      console.log(`Received response from ${modelName}`);
      
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim() === '') {
        throw new Error(`Model ${modelName} returned empty response`);
      }

      console.log(`Successfully generated text with model: ${modelName}`);
      
      // Parse the response into summary points
      const summaryPoints = parseSummaryPoints(text);
      
      if (summaryPoints.length === 0) {
        throw new Error(`Failed to parse summary points from model ${modelName} response`);
      }

      console.log(`Successfully parsed ${summaryPoints.length} summary points`);
      return summaryPoints;
    } catch (error) {
      console.error(`Error with model ${modelName}:`, error);
      modelErrors[modelName] = error instanceof Error ? error.message : 'Unknown error';
      lastError = error;
      // Continue to the next model
    }
  }

  // If we get here, all models failed
  console.error('All Gemini models failed:', modelErrors);
  throw new Error(`Failed to generate summary. Tried models: ${Object.entries(modelErrors).map(([model, error]) => `${model} (${error})`).join(', ')}`);
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transcript, videoTitle } = body;

    if (!transcript || !videoTitle) {
      return NextResponse.json(
        { error: 'Transcript and video title are required' },
        { status: 400 }
      );
    }

    const summaryPoints = await generateSummaryWithGemini(transcript, videoTitle);
    
    return NextResponse.json({ summaryPoints });
  } catch (error) {
    console.error('Error in summary generation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate summary' },
      { status: 500 }
    );
  }
} 