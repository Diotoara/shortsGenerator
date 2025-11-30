import { NextRequest, NextResponse } from "next/server";
import { FishAudioClient } from "fish-audio";
import { writeFile } from "fs/promises";


const fishAudio = new FishAudioClient({ apiKey: process.env.NEXT_PUBLIC_TEXT_TO_SPEECH });
export async function POST(req:NextRequest){
    const {text, id} = await req.json();
    try {
        const audio = await fishAudio.textToSpeech.convert({
            text: text,
            // reference_id: "d75c270eaee14c8aa1e9e980cc37cf1bs",
            reference_id: "802e3bc2b27e49c2995d23ef70e6ac89",
        });
        const buffer = Buffer.from(await new Response(audio).arrayBuffer());
        await writeFile("output.mp3", buffer);
    
        console.log("✓ Audio saved to output.mp3");
    
        return NextResponse.json({Success : true})
    } catch (error:any) {
        return NextResponse.json({
            success:false,
            "error from post man":error.body.message
        })
    }

}