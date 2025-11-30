import { GoogleGenAI } from '@google/genai';

export const aiClient = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export const tools = [
  { googleSearch: {} },
];

export const streamConfig = {
  thinkingConfig: { thinkingLevel: 'HIGH' },
  tools,
};

export const geminiModel = 'gemini-2.0-flash-lite';

// ✅ Export a function that generates stream from a prompt
export async function runGeminiStream(prompt: string) {
  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];
  console.log("-----------------------------------------")
  try {
      const response = await aiClient.models.generateContentStream({
          model: geminiModel,
          contents,
        });
        console.log("response came")
        return response
    } catch (error) {
      console.log("error in model")
  }
  
  
  
}
  
