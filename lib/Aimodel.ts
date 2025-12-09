import OpenAI from "openai";
const client = new OpenAI();


export async function runAiStream(prompt :string ){

  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });
  
    const out = response.output_text;
    console.log("response came : ")
    return out;
  } catch (error) {
    console.log("Error while creating output is : ", error)
  }
}




// import { GoogleGenAI } from '@google/genai';

// export const aiClient = new GoogleGenAI({
//   apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
// });

// export const tools = [
//   { googleSearch: {} }
// ];

// export const streamConfig = {
//   thinkingConfig: { thinkingLevel: 'HIGH' },
//   tools,
// };

// export const geminiModel = 'gemini-2.0-flash';

// // ✅ Export a function that generates stream from a prompt
// export async function runGeminiStream(prompt: string) {
//   const contents = [
//     {
//       role: 'user',
//       parts: [{ text: prompt }],
//     },
//   ];
//   console.log("-----------------------------------------")
//   try {
//       const response = await aiClient.models.generateContentStream({
//           model: geminiModel,
//           contents,
//         });
//         console.log("response came")
//         return response
//     } catch (error:any) {
//       console.log("error in model", error.message)
//   } 
  
// }
  
