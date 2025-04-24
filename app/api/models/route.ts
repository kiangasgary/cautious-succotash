import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with the server-side environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function GET() {
  try {
    // Instead of trying to list models (which isn't directly supported),
    // we'll return information about the models we're trying
    return NextResponse.json({ 
      availableModels: [
        { name: 'gemini-1.5-pro', description: 'Latest Gemini 1.5 Pro model' },
        { name: 'gemini-1.5-flash', description: 'Latest Gemini 1.5 Flash model' },
        { name: 'gemini-pro', description: 'Standard Gemini Pro model' },
        { name: 'gemini-pro-latest', description: 'Latest version of Gemini Pro' }
      ],
      apiKeyStatus: process.env.GOOGLE_GEMINI_API_KEY ? 'API key is set' : 'API key is missing'
    });
  } catch (error) {
    console.error('Error with models info:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to get models info',
        apiKey: process.env.GOOGLE_GEMINI_API_KEY ? 'API key is set' : 'API key is missing'
      },
      { status: 500 }
    );
  }
} 