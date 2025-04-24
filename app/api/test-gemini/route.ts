import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is not configured in environment variables' },
        { status: 500 }
      );
    }

    console.log('Testing Gemini API with key:', apiKey.substring(0, 10) + '...');

    // Initialize the API
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to use the simplest model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Simple test prompt
    const result = await model.generateContent('Say "Hello, this is a test!"');
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      message: 'API key is valid',
      testResponse: text
    });

  } catch (error) {
    console.error('Error testing Gemini API:', error);
    
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: 'The API key might be invalid or there might be connectivity issues'
      },
      { status: 500 }
    );
  }
} 