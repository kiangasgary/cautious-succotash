const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  try {
    const API_KEY = 'AIzaSyAdtCyDZDnURfta3H7tUhK83yArLulFzRQ';
    console.log('Testing with API key:', API_KEY.substring(0, 10) + '...');

    // Initialize with specific API version
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // First, try to list available models
    console.log('Checking available models...');
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1/models',
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.status} ${response.statusText}`);
    }

    const models = await response.json();
    console.log('Available models:', models);

    // Try to generate content
    console.log('\nTesting content generation...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Say hello!');
    const text = await result.response.text();

    console.log('Success! Response:', text);
  } catch (error) {
    console.error('Error testing API:', error.message);
    if (error.response) {
      try {
        const errorDetails = await error.response.text();
        console.error('Error details:', errorDetails);
      } catch (e) {
        console.error('Could not parse error details');
      }
    }
    // Log the full error object for debugging
    console.error('Full error:', error);
  }
}

testGeminiAPI(); 