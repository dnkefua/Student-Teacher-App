import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini API client
// The API key is automatically injected by AI Studio into process.env.NEXT_PUBLIC_GEMINI_API_KEY
export const getGeminiClient = () => {
  return new GoogleGenAI({ 
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' 
  });
};
