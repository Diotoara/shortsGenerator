import { Client } from "@gradio/client";
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import https from "https";
import { NextRequest, NextResponse } from "next/server";

const GRADIO_URL = "mrfakename/E2-F5-TTS"

const REFERENCE_TEXT = "sticking out your guy out for the Rizzler. You're so skibbity. You're so fun and tax. I just want to be your Sigma. Freaking come here. Give me your Ohio."; 


export async function POST(req:NextRequest) {
  
  const {text} = await req.json();
  const TEXT_TO_GENERATE = text; 

    try {
        const client = await Client.connect(GRADIO_URL);
        const response_0 = await fetch("https://drive.google.com/uc?export=download&id=1Olu_AQFs4u_5EaB0JZWe-aK6nr3v0MQD");
        const exampleAudio = await response_0.blob();
        const audioInput = exampleAudio;
        const result:any = await client.predict("/predict", { 
          ref_audio: audioInput,    
          ref_text: REFERENCE_TEXT, 
          gen_text: TEXT_TO_GENERATE,       
        });
        const synthesizedAudioData = result.data[0]; 
        if (synthesizedAudioData && synthesizedAudioData.url) {
            
            const audioDownloadURL = synthesizedAudioData.url;
            try {
              const folder = "../../../outputs";
              !fs.existsSync(folder) && fs.mkdirSync(folder);
              https.get(audioDownloadURL, (res) => 
                res.pipe(fs.createWriteStream(`${folder}/output.mp3`))
              );
              console.log("file download at "+ folder+"/output.mp3")
            } catch (error) {
              console.log("error in saving file : " + error)
            }

            console.error("❌ Error: Audio data not found in the response.");
        }
        return NextResponse.json({
          success:true
        },{
          status:200
        })

    } catch (error) {
        console.error("An error occurred during TTS generation:", error);
        return NextResponse.json({
          success:false,
          error: error
        })
    }
}