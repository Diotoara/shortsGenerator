import { NextRequest, NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";

export async function POST(req:NextRequest){

    try {
        const {audioFileUrl} = await req.json();
        const client = new AssemblyAI({
        apiKey:process.env.CAPTION_API || ""
        });
    
        const audioFile = audioFileUrl
    
        const params = {
        audio: audioFile,
        speech_models: ["universal"],
        };
    
        const transcript = await client.transcripts.transcribe(params);
        console.log(transcript.text);
    
        return NextResponse.json({
            'result' : transcript.words
        })
    } catch (error) {
        return NextResponse.json({
            'error' : error
        })
    }

}